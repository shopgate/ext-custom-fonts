import config from './config';

/**
 * Config getter. Returns a config imported from a json file.
 * Usefull for mocking during the tests.
 * @returns {Object}
 */
function getConfig() {
  return config;
}

export default getConfig;
