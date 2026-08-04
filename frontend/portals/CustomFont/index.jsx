import React from 'react';
import Helmet from 'react-helmet';
import { css } from 'glamor';
import { logger } from '@shopgate/engage/core/helpers';
import { configuration } from '@shopgate/engage/core/collections';
import { CONFIGURATION_COLLECTION_KEY_HAS_ROOT_TYPOGRAPHY } from '@shopgate/engage/core/constants';
import {
  buildRootTypographyProps,
  serializeRootTypographyProps,
  applyRootTypographyStyle,
} from '../../rootTypography';
import getConfig from '../../getConfig';

/**
 * Whether the current PWA renders base typography through the `--sg-root-*` custom properties. The
 * PWA sets this capability flag on the shared configuration collection; on older PWA versions the
 * constant is `undefined` and the flag is never set, so the check is falsy.
 * @returns {boolean}
 */
const supportsRootTypography = () => !!(
  CONFIGURATION_COLLECTION_KEY_HAS_ROOT_TYPOGRAPHY
  && configuration.get(CONFIGURATION_COLLECTION_KEY_HAS_ROOT_TYPOGRAPHY)
);

/**
 * Adds fonts link and applies the configured typography.
 *
 * On a PWA that renders base typography through the `--sg-root-*` custom properties (detected via
 * the configuration collection flag) the configured `font` shorthand is decomposed and applied as
 * those properties on `:root` - so it targets `<html>` and flows into the theme variants. The
 * `:root` rule is injected before the theme css insertion point so theme.css and the admin preview
 * can override it. Any leftover non-font declarations are applied to `<html>` too. On older PWA
 * versions it falls back to the legacy `<body>` override.
 * @returns {JSX}
 */
const CustomFont = () => {
  const { rules, url } = getConfig();

  if (!rules || !url) {
    logger.error('CustomFonts: Invalid config. Aborting.', getConfig());
    return null;
  }

  if (Object.keys(rules).length) {
    if (supportsRootTypography()) {
      const { rootProps, otherRules } = buildRootTypographyProps(rules);

      if (Object.keys(rootProps).length) {
        applyRootTypographyStyle(serializeRootTypographyProps(rootProps));
      }

      // Preserve any non-font declarations, now targeting the root element. They target `html`
      // (lower specificity than the `:root` overrides), so theme.css and the preview still win.
      if (Object.keys(otherRules).length) {
        css.global('html', otherRules);
      }
    } else {
      // Legacy behavior for PWA versions without root typography custom properties.
      css.global('body', rules);
    }
  }

  return (
    <Helmet>
      <link rel="stylesheet" href={url} />
    </Helmet>
  );
};

export default CustomFont;
