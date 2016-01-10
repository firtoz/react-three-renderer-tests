import assert from 'assert';

module.exports = class MockConsole {
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
${_messages.map(({ args, stack }, i) => `${i}: ${this._printArgs(args, stack)}`).join('\n')}`);
    } else if (_expectedMessages.length > 0) {
      assert(false, `Messages expected but not received:
${_expectedMessages.map((args, i) => `${i}: ${this._printArgs(args)}`).join('\n')}`);
    }
  }

  _printArgs(args, stack) {
    return `[${args.type || `LOG`}]|${args.join('\t')}${stack ? `\n${stack}\n` : ''}`;
  }

  log(...args) {
    args.type = 'LOG';

    this._messageReceived(args, new Error().stack);
  }

  warn(...args) {
    args.type = 'WARNING';

    this._messageReceived(args, new Error().stack);
  }

  error(...args) {
    args.type = 'ERROR';

    this._messageReceived(args, new Error().stack);
  }

  _messageReceived(args, stack) {
    const {
      _messages,
      _expectedMessages,
      } = this;

    if (_expectedMessages.length > 0) {
      this._checkMessage(_expectedMessages.shift(), { args, stack });
    } else {
      _messages.push({
        args,
        stack,
      });
    }
  }

  _checkMessage(expectedArgs, { args: actualArgs, stack }) {
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
> ${actualMessage}${stack ? `\n${stack}\n` : ''}`);
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
