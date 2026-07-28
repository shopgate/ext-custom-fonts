/**
 * CSS custom property names for the root (base) typography. These mirror the constants published by
 * the PWA reset (`@shopgate/engage/styles`), but are defined locally so the extension stays
 * self-contained and does not import from the heavy `@shopgate/engage/styles` barrel (theme +
 * tss-react + emotion), which would also couple the extension to a specific engage version.
 */
export const CSS_ROOT_FONT_FAMILY = '--sg-root-font-family';
export const CSS_ROOT_FONT_SIZE = '--sg-root-font-size';
export const CSS_ROOT_LINE_HEIGHT = '--sg-root-line-height';

/**
 * Maps css `font` longhand keys (glamor camelCase) to their root typography custom property.
 * @type {Object}
 */
const FONT_LONGHAND_TO_PROP = {
  fontFamily: CSS_ROOT_FONT_FAMILY,
  fontSize: CSS_ROOT_FONT_SIZE,
  lineHeight: CSS_ROOT_LINE_HEIGHT,
};

/**
 * Strips a trailing `!important` from a css value. It is not needed on the root typography custom
 * properties since the reset/theme consume them via `var()`.
 * @param {*} value A css declaration value.
 * @returns {*}
 */
export const stripImportant = value => (typeof value === 'string'
  ? value.replace(/\s*!important\s*$/i, '')
  : value);

/**
 * Maps the resolved font longhands of a CSSStyleDeclaration (or a plain object with the same keys)
 * onto the root typography custom properties.
 * @param {Object} style An object exposing `fontFamily` / `fontSize` / `lineHeight`.
 * @returns {Object} A map of root typography custom property name to value.
 */
export const fontStyleToProps = (style = {}) => {
  const props = {};
  const { fontFamily, fontSize, lineHeight } = style;

  if (fontFamily) props[CSS_ROOT_FONT_FAMILY] = fontFamily;
  if (fontSize) props[CSS_ROOT_FONT_SIZE] = fontSize;
  if (lineHeight && lineHeight !== 'normal') props[CSS_ROOT_LINE_HEIGHT] = lineHeight;

  return props;
};

/**
 * Decomposes a css `font` shorthand string into its family/size/line-height parts using the
 * browser's CSSOM parser (spec compliant, handles any valid shorthand). A trailing `!important` is
 * removed first. Returns an empty object when the value is not a string or there is no DOM.
 *
 * Note: relies on the CSSOM expanding the `font` shorthand into its longhands, which real browsers
 * do but jsdom does not - so under jsdom this yields `{}`.
 * @param {string} value A css `font` shorthand, e.g. `16px/1.5 Roboto, Arial, sans-serif`.
 * @returns {Object} A map of root typography custom property name to value.
 */
export const decomposeFontShorthand = (value) => {
  if (typeof value !== 'string' || typeof document === 'undefined') {
    return {};
  }

  const probe = document.createElement('span');
  probe.style.font = stripImportant(value);

  return fontStyleToProps(probe.style);
};

/**
 * Builds the root typography custom properties (and any leftover non-font rules) from the extension
 * `rules` object.
 *
 * - a `font` shorthand is decomposed into the three `--sg-root-*` properties,
 * - the `fontFamily` / `fontSize` / `lineHeight` longhands map to the matching property,
 * - every other declaration is returned untouched in `otherRules`.
 *
 * The structured `typography` config is intentionally NOT handled here - it is fed to the theme via
 * the subscriptions (`CONFIGURATION_COLLECTION_KEY_THEME_TYPOGRAPHY`), so injecting it again as css
 * would be a redundant second path.
 * @param {Object} [rules={}] The configured css declarations (glamor style).
 * @returns {{ rootProps: Object, otherRules: Object }}
 */
export const buildRootTypographyProps = (rules = {}) => {
  const rootProps = {};
  const otherRules = {};

  Object.entries(rules).forEach(([key, value]) => {
    if (key === 'font') {
      Object.assign(rootProps, decomposeFontShorthand(value));
    } else if (FONT_LONGHAND_TO_PROP[key]) {
      rootProps[FONT_LONGHAND_TO_PROP[key]] = stripImportant(value);
    } else {
      otherRules[key] = value;
    }
  });

  return {
    rootProps,
    otherRules,
  };
};

/**
 * Serializes root typography custom properties into a `:root` css rule string.
 * @param {Object} rootProps A map of custom property name to value.
 * @returns {string}
 */
export const serializeRootTypographyProps = rootProps => `:root { ${Object.entries(rootProps)
  .map(([property, value]) => `${property}: ${value};`)
  .join(' ')} }`;

export const ROOT_TYPOGRAPHY_STYLE_TAG_ID = 'custom-fonts-root-typography';

const THEME_CSS_INSERTION_POINT_SELECTOR = 'meta[name="theme-css-insertion-point"]';

/**
 * Injects the given css text into a `<style>` positioned right before the theme css insertion
 * point, so it sits with the theming defaults - after them, but BEFORE the theme css file and the
 * admin preview overrides. The `:root` custom properties share the same specificity as those
 * layers, so document order decides; this placement lets theme.css and the preview override the
 * extension. Appending to `<head>` (as react-helmet / glamor do) would instead place it after both
 * and make it win. Idempotent - reuses the tag on re-render and only updates its text.
 * @param {string} cssText The css rule(s) to inject.
 */
export const applyRootTypographyStyle = (cssText) => {
  if (typeof document === 'undefined') {
    return;
  }

  let styleTag = document.getElementById(ROOT_TYPOGRAPHY_STYLE_TAG_ID);

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.setAttribute('id', ROOT_TYPOGRAPHY_STYLE_TAG_ID);
    styleTag.setAttribute('type', 'text/css');

    const insertionPoint = document.querySelector(THEME_CSS_INSERTION_POINT_SELECTOR);

    if (insertionPoint) {
      insertionPoint.parentNode.insertBefore(styleTag, insertionPoint);
    } else {
      // Older PWA templates without the anchor - fall back to appending.
      document.head.appendChild(styleTag);
    }
  }

  styleTag.textContent = cssText;
};
