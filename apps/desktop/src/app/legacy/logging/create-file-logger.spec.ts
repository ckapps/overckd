import { LogLevel } from '@ckapp/rxjs-snafu/lib/cjs/log';

import { Logger } from './log';
import { createFileLogger } from './create-file-logger';

describe('logging/create-file-logger', () => {
  const mockLogger = {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    verbose: vi.fn(),
    silly: vi.fn(),
    log: vi.fn(),
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
      'should call log function %s',
      (logFunction: keyof Logger) => {
        fileLogger[logFunction]();

        expect(mockLogger[logFunction]).toHaveBeenCalled();
      },
    );
  });
});
