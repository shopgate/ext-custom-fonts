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
  const { rules, url, urls = [] } = getConfig();

  if (!rules || (!url && !urls.length)) {
    logger.error('CustomFonts: Invalid config. Aborting.', getConfig());
    return null;
  }

  if (rules) {
    // Adding global props.
    if (Object.keys(rules).length) {
      css.global('body', rules);
    }
  }

  return (
    <Helmet>
      { url && <link rel="stylesheet" href={url} /> }
      { urls && urls.map(href => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
    </Helmet>
  );
};

export default CustomFont;
