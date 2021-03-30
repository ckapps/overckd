import { LogFunction, LogLevel } from '@overckd/domain';

export type LogIO = (opts: LoggerOptions) => LogFunction;

export type LoggerOptions = {
  /**
   * The message to log
   */
  message: string;
  /**
   * The log level
   */
  level?: LogLevel;
  /**
   * Optional prefixes
   */
  prefixes?: unknown[];
  /**
   * Optional suffixes
   */
  suffixes?: unknown[];
  /**
   * If `true` the log message will additionally
   * passed arguments
   */
  withArguments?: boolean;
};
