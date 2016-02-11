import MockConsole from './MockConsole';
import ReactDOM from 'react-dom';
import chai from 'chai';
import React from 'react';

const { expect } = chai;

module.exports = (type) => {
  const testDiv = document.createElement('div');

  function requireHelper(path) {
    switch (type) {
      case 'src':
        return require(`../../../src/lib/${path}`);
      case 'lib':
        return require(`../../../lib/${path}`);
      default:
        expect(false, 'Invalid test type');
        break;
    }
  }

  let React3;
  switch (type) {
    case 'src':
      React3 = require('../../../src/lib/React3');
      break;
    case 'lib':
      React3 = require('../../../lib/React3');
      break;
    default:
      expect(false, 'Invalid test type');
      break;
  }

  const mockConsole = new MockConsole();

  before(() => {
    document.body.appendChild(testDiv);

    // warmup
    ReactDOM.render((<React3
      key="warmup"
      width={1}
      height={1}
    />), testDiv);
  });

  beforeEach(() => {
    mockConsole.apply();
  });

  afterEach(function _() {
    ReactDOM.unmountComponentAtNode(testDiv);

    if (this.currentTest.state === 'failed') {
      // there were errors, no need to check more
      mockConsole.revert(true);
    } else {
      mockConsole.revert();
    }
  });

  after(() => {
    document.body.removeChild(testDiv);
  });

  return {
    testDiv,
    React3,
    /**
     * @type {MockConsole}
     */
    mockConsole,
    requireHelper,
  };
};
