import React from 'react';
import Helmet from 'react-helmet';
import { css } from 'glamor';
import { logger } from '@shopgate/pwa-core/helpers';
import getConfig from '../../getConfig';

/**
 * Adds fonts link and applies css properties configured in the extension settings.
 * @returns {JSX}
 */
const CustomFont = () => {
  const { rules, url } = getConfig();

  if (!rules || !url) {
    logger.error('CustomFonts: Invalid config. Aborting.', getConfig());
    return null;
  }

  // Adding global props.
  if (Object.keys(rules).length) {
    css.global('body', rules);
  }

  return (
    <Helmet>
      <link rel="stylesheet" href={url} />
    </Helmet>
  );
};

export default CustomFont;
