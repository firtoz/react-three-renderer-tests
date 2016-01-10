import React from 'react';
import ReactDOM from 'react-dom';
import MockConsole from '../../utils/MockConsole';
import chai from 'chai';

module.exports = type => {
  const testDiv = document.createElement('div');
  const { expect } = chai;

  let React3;
  switch (type) {
    case 'src':
      React3 = require('../../../../src/lib/React3');
      break;
    case 'lib':
      React3 = require('../../../../lib/React3');
      break;
    default:
      expect(false, 'Invalid test type');
      break;
  }

  let mockConsole;

  before(() => {
    document.body.appendChild(testDiv);

    // warmup
    ReactDOM.render(<React3
      key="warmup"
      width={1}
      height={1}
    />, testDiv);
  });

  beforeEach(() => {
    mockConsole = new MockConsole();

    mockConsole.apply();
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(testDiv);

    mockConsole.revert();
  });

  after(() => {
    document.body.removeChild(testDiv);
  });

  it('Mounts with prop warnings', () => {
    mockConsole.expect('Warning: Failed propType: ' +
      'Required prop `width` was not specified in `React3`.');
    mockConsole.expect('Warning: Failed propType: ' +
      'Required prop `height` was not specified in `React3`.');

    mockConsole.expect('Warning: Failed propType: ' +
      'Required prop `width` was not specified in `react3`.');
    mockConsole.expect('Warning: Failed propType: ' +
      'Required prop `height` was not specified in `react3`.');

    mockConsole.expect('THREE.WebGLRenderer	73');

    ReactDOM.render(<React3/>, testDiv);

    expect(testDiv.firstChild).to.be.an.instanceOf(HTMLCanvasElement);
  });

  it('Mounts without warnings', () => {
    const react3Instance = ReactDOM.render(<React3
      width={800}
      height={600}
    />, testDiv);

    mockConsole.expect('THREE.WebGLRenderer	73');

    expect(testDiv.firstChild).to.be.an.instanceOf(HTMLCanvasElement);
    const canvas = ReactDOM.findDOMNode(react3Instance);
    expect(canvas).to.equal(testDiv.firstChild);

    expect(canvas.userData).to.exist();
  });
};
