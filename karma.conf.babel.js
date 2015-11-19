// Karma configuration

import webpackConfig from './webpack.config.babel.js';

const isCoverage = process.env.KARMA_COVERAGE === 'true';

if (isCoverage) {
  console.warn('Coverage enabled.'); // eslint-disable-line
}

export default (config) => {
  const configuration = {
    browsers: [
      'Chrome',
    ],

    files: [
      'src/tests.js',
      // each file acts as entry point for the webpack configuration
    ],

    frameworks: ['mocha'],

    preprocessors: {
      // add webpack as preprocessor
      'src/tests.js': ['webpack'],
    },

    reporters: [
      'spec',
    ].concat(isCoverage ? ['coverage'] : []),

    coverageReporter: {
      type: 'html',
      dir: 'build/coverage/',
    },

    webpack: {
      ...webpackConfig,
    },

    webpackMiddleware: {
      ...webpackConfig.devServer,
      quiet: true,
      noInfo: true,
    },

    plugins: [
      require('karma-webpack'),
      require('karma-mocha'),
      require('karma-spec-reporter'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
    ].concat(isCoverage ? [
      require('istanbul-instrumenter-loader'),
      require('karma-coverage'),
    ] : []),
  };

  if (process.env.TRAVIS) {
    configuration.customLaunchers = {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: [
          '--use-gl=osmesa',
          '--user-data-dir=~/tmp/x',
          '--no-sandbox',
          '--use-gl=osmesa',
          '--enable-logging=stderr',
          '--v=1',
          '--no-first-run',
          '--noerrdialogs',
          '--disable-web-security',
        ],
      },
    };

    // http://swizec.com/blog/how-to-run-javascript-tests-in-chrome-on-travis/swizec/6647
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
