import { appWillInit$ } from '@shopgate/engage/core/streams';
import { configuration } from '@shopgate/engage/core/collections';
import { CONFIGURATION_COLLECTION_KEY_THEME_TYPOGRAPHY } from '@shopgate/engage/core/constants';
import getConfig from './getConfig';

/**
 * Subscriptions
 * @param {Function} subscribe subscribe
 */
export default (subscribe) => {
  // Collection key for typography settings not provided by PWA - skip following logic.
  if (!CONFIGURATION_COLLECTION_KEY_THEME_TYPOGRAPHY) {
    return;
  }

  const { typography } = getConfig();

  if (!typography || Object.keys(typography).length === 0) {
    // Empty typography settings - skip following logic.
    return;
  }

  subscribe(appWillInit$, () => {
    configuration.set(CONFIGURATION_COLLECTION_KEY_THEME_TYPOGRAPHY, typography);
  });
};

