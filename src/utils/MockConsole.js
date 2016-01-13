import assert from 'assert';
import util from 'util';
import EventEmitter from 'events';

module.exports = class MockConsole {
  constructor() {
    this.prevConsole = window.console;

    this._messages = [];
    this._expectedMessages = [];

    this._events = new EventEmitter();

    this._verbose = false;
  }

  once(eventType, callback) {
    this._events.on(eventType, callback);
  }

  apply() {
    this.prevConsole = window.console;

    window.console = this;
  }

  revert(ignoreChecks) {
    window.console = this.prevConsole;
    this._verbose = false;
    this._events.removeAllListeners();

    if (ignoreChecks) {
      this._messages = [];
      this._expectedMessages = [];

      return;
    }

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
    return `[${args.type || `LOG`}]|${args.map(arg => {
      return util.inspect(arg, {});
    }).join('\t')}${stack ? `\n${stack}\n` : ''}`;
  }

  log(...args) {
    if (this._verbose) {
      this.prevConsole.log.apply(this.prevConsole, args);
    }

    args.type = 'LOG';

    this._messageReceived(args, new Error().stack);
  }

  warn(...args) {
    if (this._verbose) {
      this.prevConsole.warn.apply(this.prevConsole, args);
    }

    args.type = 'WARNING';

    this._messageReceived(args, new Error().stack);
  }

  error(...args) {
    if (this._verbose) {
      this.prevConsole.error.apply(this.prevConsole, args);
    }

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

      if (_expectedMessages.length === 0) {
        this._events.emit('empty');
      }
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

      assert(false, `Log error, expected message:
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
