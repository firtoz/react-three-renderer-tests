import MockConsole from './MockConsole';
import ReactDOM from 'react-dom';
import chai from 'chai';
import React from 'react';

const { expect } = chai;

module.exports = (type) => {
  const testDiv = document.createElement('div');

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

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(testDiv);

    mockConsole.revert();
  });

  after(() => {
    document.body.removeChild(testDiv);
  });

  return {
    testDiv,
    React3,
    mockConsole,
  };
};
