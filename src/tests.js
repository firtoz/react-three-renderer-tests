import 'source-map-support/browser-source-map-support';
import chai from 'chai';
import dirtyChai from 'dirty-chai';

chai.use(dirtyChai);

sourceMapSupport.install({ // eslint-disable-line no-undef
  handleUncaughtExceptions: false,
});

describe('React3', () => {
  require('./core/React3/React3Mounts.js');
});

describe('Warnings', () => {
  require('./core/Warnings/Vectors.js');
});
