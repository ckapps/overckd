export type LogFunction = (...params: any[]) => void;

export enum LogLevel {
  Error = 'error',
  Warning = 'warn',
  Info = 'info',
  Verbose = 'verbose',
  Silly = 'silly',
  Debug = 'debug',
}

export interface Logger {
  log: LogFunction;
  [LogLevel.Error]: LogFunction;
  [LogLevel.Warning]: LogFunction;
  [LogLevel.Info]: LogFunction;
  [LogLevel.Verbose]: LogFunction;
  [LogLevel.Silly]: LogFunction;
  [LogLevel.Debug]: LogFunction;
}
