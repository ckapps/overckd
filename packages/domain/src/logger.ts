type LogFunction = (...params: any[]) => void;

export interface Logger {
  log: LogFunction;
  debug: LogFunction;
  error: LogFunction;
  info: LogFunction;

  silly: LogFunction;
  verbose: LogFunction;
  warn: LogFunction;
}
