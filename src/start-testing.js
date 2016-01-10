import 'source-map-support/browser-source-map-support';
import chai from 'chai';
import dirtyChai from 'dirty-chai';

sourceMapSupport.install({ // eslint-disable-line no-undef
  handleUncaughtExceptions: false,
});

chai.use(dirtyChai);

module.exports = (type) => {
  describe(`${type}/React3`, () => {
    require('./core/React3/React3Mounts')(type);
  });

  describe(`${type}/Warnings`, () => {
    require('./core/Warnings/PropTypes')(type);
  });
};