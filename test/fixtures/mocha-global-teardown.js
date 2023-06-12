/**
 * [GLOBAL TEARDOWN FIXTURES](https://mochajs.org/#global-teardown-fixtures)
 */
exports.mochaGlobalTeardown = function () {
  console.log(Array.from({ length: 100 }).join('░'));
};
