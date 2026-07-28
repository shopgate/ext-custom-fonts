import {
  CSS_ROOT_FONT_FAMILY,
  CSS_ROOT_FONT_SIZE,
  CSS_ROOT_LINE_HEIGHT,
  ROOT_TYPOGRAPHY_STYLE_TAG_ID,
  stripImportant,
  fontStyleToProps,
  decomposeFontShorthand,
  buildRootTypographyProps,
  serializeRootTypographyProps,
  applyRootTypographyStyle,
} from './rootTypography';

/**
 * Builds a fake element whose `style.font` setter expands the shorthand into longhands, standing in
 * for the CSSOM parsing that real browsers do but jsdom does not.
 * @returns {Object}
 */
const createBrowserLikeElement = () => {
  const style = {};

  Object.defineProperty(style, 'font', {
    set(value) {
      const [head, ...familyParts] = value.trim().split(' ');
      const [size, lineHeight = ''] = head.split('/');
      style.fontSize = size;
      style.lineHeight = lineHeight;
      style.fontFamily = familyParts.join(' ');
    },
  });

  return { style };
};

describe('ext-custom-fonts/rootTypography', () => {
  describe('stripImportant()', () => {
    it('removes a trailing !important from strings', () => {
      expect(stripImportant('16px/1.5 Roboto !important')).toBe('16px/1.5 Roboto');
      expect(stripImportant('700   !important  ')).toBe('700');
    });

    it('leaves values without !important untouched', () => {
      expect(stripImportant('16px')).toBe('16px');
    });

    it('passes through non-string values', () => {
      expect(stripImportant(1.5)).toBe(1.5);
      expect(stripImportant(undefined)).toBeUndefined();
    });
  });

  describe('fontStyleToProps()', () => {
    it('maps the font longhands to the root typography properties', () => {
      expect(fontStyleToProps({
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: '16px',
        lineHeight: '1.5',
      })).toEqual({
        [CSS_ROOT_FONT_FAMILY]: 'Roboto, Arial, sans-serif',
        [CSS_ROOT_FONT_SIZE]: '16px',
        [CSS_ROOT_LINE_HEIGHT]: '1.5',
      });
    });

    it('omits empty and `normal` line-height values', () => {
      expect(fontStyleToProps({
        fontSize: '16px',
        lineHeight: 'normal',
      })).toEqual({ [CSS_ROOT_FONT_SIZE]: '16px' });
      expect(fontStyleToProps({})).toEqual({});
    });
  });

  describe('decomposeFontShorthand()', () => {
    it('returns an empty object for non-string input', () => {
      expect(decomposeFontShorthand(undefined)).toEqual({});
      expect(decomposeFontShorthand(16)).toEqual({});
    });

    describe('with a browser-like CSSOM', () => {
      beforeEach(() => {
        jest.spyOn(document, 'createElement').mockImplementation(createBrowserLikeElement);
      });

      afterEach(() => {
        document.createElement.mockRestore();
      });

      it('decomposes a font shorthand into the root typography properties', () => {
        expect(decomposeFontShorthand('16px/1.5 Roboto, Arial, sans-serif')).toEqual({
          [CSS_ROOT_FONT_FAMILY]: 'Roboto, Arial, sans-serif',
          [CSS_ROOT_FONT_SIZE]: '16px',
          [CSS_ROOT_LINE_HEIGHT]: '1.5',
        });
      });

      it('ignores a trailing !important while decomposing', () => {
        expect(decomposeFontShorthand('16px/1.5 Roboto !important')).toEqual({
          [CSS_ROOT_FONT_FAMILY]: 'Roboto',
          [CSS_ROOT_FONT_SIZE]: '16px',
          [CSS_ROOT_LINE_HEIGHT]: '1.5',
        });
      });
    });
  });

  describe('buildRootTypographyProps()', () => {
    it('maps font longhands to the matching custom properties and strips !important', () => {
      const { rootProps, otherRules } = buildRootTypographyProps({
        fontFamily: 'Roboto, sans-serif',
        fontSize: '17px',
        lineHeight: '1.43 !important',
      });

      expect(rootProps).toEqual({
        [CSS_ROOT_FONT_FAMILY]: 'Roboto, sans-serif',
        [CSS_ROOT_FONT_SIZE]: '17px',
        [CSS_ROOT_LINE_HEIGHT]: '1.43',
      });
      expect(otherRules).toEqual({});
    });

    it('decomposes a font shorthand key', () => {
      jest.spyOn(document, 'createElement').mockImplementation(createBrowserLikeElement);

      const { rootProps } = buildRootTypographyProps({
        font: '16px/1.5 Roboto, Arial, sans-serif !important',
      });

      expect(rootProps).toEqual({
        [CSS_ROOT_FONT_FAMILY]: 'Roboto, Arial, sans-serif',
        [CSS_ROOT_FONT_SIZE]: '16px',
        [CSS_ROOT_LINE_HEIGHT]: '1.5',
      });

      document.createElement.mockRestore();
    });

    it('keeps non-font declarations in otherRules', () => {
      const { rootProps, otherRules } = buildRootTypographyProps({
        fontSize: '17px',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      });

      expect(rootProps).toEqual({ [CSS_ROOT_FONT_SIZE]: '17px' });
      expect(otherRules).toEqual({
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      });
    });
  });

  describe('serializeRootTypographyProps()', () => {
    it('serializes props into a :root rule', () => {
      const css = serializeRootTypographyProps({
        [CSS_ROOT_FONT_SIZE]: '17px',
        [CSS_ROOT_LINE_HEIGHT]: '1.43',
      });

      expect(css).toBe(':root { --sg-root-font-size: 17px; --sg-root-line-height: 1.43; }');
    });
  });

  describe('applyRootTypographyStyle()', () => {
    afterEach(() => {
      document.head.innerHTML = '';
    });

    it('inserts a style tag before the theme css insertion point so later layers override it', () => {
      document.head.innerHTML = '<meta name="theme-css-insertion-point">';
      const insertionPoint = document.head.querySelector('meta[name="theme-css-insertion-point"]');

      applyRootTypographyStyle(':root { --sg-root-font-size: 17px; }');

      const styleTag = document.getElementById(ROOT_TYPOGRAPHY_STYLE_TAG_ID);
      expect(styleTag).not.toBeNull();
      expect(styleTag.textContent).toBe(':root { --sg-root-font-size: 17px; }');
      // The style must precede the anchor (theme.css + preview are inserted at/after it).
      expect(styleTag.nextSibling).toBe(insertionPoint);
    });

    it('falls back to appending to <head> when the anchor is absent', () => {
      applyRootTypographyStyle(':root { --sg-root-font-size: 17px; }');

      const styleTag = document.getElementById(ROOT_TYPOGRAPHY_STYLE_TAG_ID);
      expect(styleTag).not.toBeNull();
      expect(styleTag.parentNode).toBe(document.head);
    });

    it('reuses the same tag and only updates its content on repeated calls', () => {
      applyRootTypographyStyle(':root { --sg-root-font-size: 17px; }');
      applyRootTypographyStyle(':root { --sg-root-font-size: 20px; }');

      const tags = document.querySelectorAll(`#${ROOT_TYPOGRAPHY_STYLE_TAG_ID}`);
      expect(tags).toHaveLength(1);
      expect(tags[0].textContent).toBe(':root { --sg-root-font-size: 20px; }');
    });
  });
});
