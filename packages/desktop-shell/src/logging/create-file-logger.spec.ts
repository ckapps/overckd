import { LogLevel } from '@ckapp/rxjs-snafu/lib/cjs/log';

import { Logger } from './log';
import { createFileLogger } from './create-file-logger';

describe('logging/create-file-logger', () => {
  const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    verbose: jest.fn(),
    silly: jest.fn(),
    log: jest.fn(),
  };

  let fileLogger: Logger;

  describe('with file-name', () => {
    beforeEach(() => {
      fileLogger = createFileLogger(mockLogger, 'mock-file');
    });

    it('should return a logger', () => {
      expect(fileLogger).toBeDefined();
    });
  });

  describe('within cwd', () => {
    beforeEach(() => {
      fileLogger = createFileLogger(mockLogger, `${process.cwd()}/mock-file`);
    });

    it('should return a logger with shortened filepath', () => {
      expect(fileLogger).toBeDefined();
    });

    type TestCase = [keyof Logger];
    test.each([
      [LogLevel.Debug],
      [LogLevel.Error],
      [LogLevel.Info],
      ['log'],
      [LogLevel.Debug],
      [LogLevel.Verbose],
      [LogLevel.Warning],
    ] as TestCase[])(
      'should call log function %p',
      (logFunction: keyof Logger) => {
        fileLogger[logFunction]();

        expect(mockLogger[logFunction]).toBeCalled();
      },
    );
  });
});
