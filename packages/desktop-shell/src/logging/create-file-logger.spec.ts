import { LogFunctions } from 'electron-log';

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

  let fileLogger: LogFunctions;

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

    type TestCase = [keyof LogFunctions];
    test.each([
      ['debug'],
      ['error'],
      ['info'],
      ['log'],
      ['silly'],
      ['verbose'],
      ['warn'],
    ] as TestCase[])(
      'should call log function %p',
      (logFunction: keyof LogFunctions) => {
        fileLogger[logFunction]();

        expect(mockLogger[logFunction]).toBeCalled();
      },
    );
  });
});
