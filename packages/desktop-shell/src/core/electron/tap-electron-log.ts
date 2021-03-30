import { LogLevel } from '@overckd/domain';
import * as log from 'electron-log';
import { MonoTypeOperatorFunction } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface TapElectronLogOptions {
  /**
   * Logger that should be used
   */
  logger: log.LogFunctions;
  /**
   * Logging level
   */
  level: LogLevel;
  /**
   * Optional prefixes
   */
  prefixes?: unknown[];
  /**
   * Optional suffixes
   */
  suffixes?: unknown[];
  /**
   * If `true`, logging will append
   * the emitted values
   */
  withEmittedValues?: boolean;
}

/**
 * @param options
 *
 * @returns
 * Operator function that logs with the
 * values provided by the `options`.
 * Logs, whenever the source emits a value.
 */
export function tapElectronLog<T>(
  options: TapElectronLogOptions,
): MonoTypeOperatorFunction<T> {
  const {
    logger,
    level,
    withEmittedValues = true,
    prefixes = [],
    suffixes = [],
  } = options;

  const logFn = logger[level];

  return tap((...sources) => {
    const logArguments = [...prefixes];
    if (withEmittedValues) {
      logArguments.push(...sources);
    }
    logArguments.push(...suffixes);

    logFn(...logArguments);
  });
}
