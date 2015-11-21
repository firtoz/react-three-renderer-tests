import assert from 'assert';

export default
class MockConsole {
  constructor() {
    this.prevConsole = window.console;

    this._messages = [];
    this._expectedMessages = [];
  }

  apply() {
    window.console = this;
  }

  revert() {
    window.console = this.prevConsole;

    const {
      _messages,
      _expectedMessages,
      } = this;

    if (_messages.length > 0) {
      assert(false, `Messages received but not expected:
${_messages.map((args, i) => `${i}: ${this._printArgs(args)}`).join('\n')}`);
    } else if (_expectedMessages.length > 0) {
      assert(false, `Messages expected but not received:
${_expectedMessages.map((args, i) => `${i}: ${this._printArgs(args)}`).join('\n')}`);
    }
  }

  _printArgs(args) {
    return `[${args.type || `LOG`}]|${args.join('\t')}`;
  }

  log(...args) {
    args.type = 'LOG';

    this._messageReceived(args);
  }

  warn(...args) {
    args.type = 'WARNING';

    this._messageReceived(args);
  }

  error(...args) {
    args.type = 'ERROR';

    this._messageReceived(args);
  }

  _messageReceived(args) {
    const {
      _messages,
      _expectedMessages,
      } = this;

    if (_expectedMessages.length > 0) {
      this._checkMessage(_expectedMessages.shift(), args);
    } else {
      _messages.push(args);
    }
  }

  _checkMessage(expectedArgs, actualArgs) {
    const expectedMessage = `${expectedArgs.join('\t')}`;
    const actualMessage = `${actualArgs.join('\t')}`;

    if (actualMessage !== expectedMessage) {
      const {
        _messages,
        _expectedMessages,
        } = this;

      // reset state to reduce additional errors
      _messages.length = 0;
      _expectedMessages.length = 0;

      throw new Error(`Log error, expected message:
> ${expectedMessage}
But received message:
> ${actualMessage}`);
    }
  }

  expect(...args) {
    const {
      _messages,
      _expectedMessages,
      } = this;
    if (_messages.length > 0) {
      this._checkMessage(args, _messages.shift());
    } else {
      _expectedMessages.push(args);
    }
  }
};
