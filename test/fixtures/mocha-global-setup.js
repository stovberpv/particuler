require('ts-node').register({ project: 'test/tsconfig.json' });
require('tsconfig-paths').register();

require('reflect-metadata');

/**
 * [GLOBAL SETUP FIXTURES](https://mochajs.org/#global-setup-fixtures)
 */
exports.mochaGlobalSetup = function () {
  console.log(Array.from({ length: 100 }).join('░'));
};
