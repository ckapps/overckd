import { LogFunctions } from 'electron-log';

import { prefixLogSuffix } from './prefix-log-suffix';

describe('logging/prefix-log-suffix', () => {
  const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    verbose: jest.fn(),
    silly: jest.fn(),
    log: jest.fn(),
  };

  let logger: LogFunctions;
  beforeEach(() => {
    logger = prefixLogSuffix(mockLogger);
  });

  it('should return a logger', () => {
    expect(logger).toBeDefined();
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
      logger[logFunction]();

      expect(mockLogger[logFunction]).toBeCalled();
    },
  );
});
