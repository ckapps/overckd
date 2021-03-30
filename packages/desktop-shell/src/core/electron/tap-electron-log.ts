import { LogLevel } from '@overckd/domain';
import { MonoTypeOperatorFunction } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Logger } from '../../logging';
import { prefixLogSuffix } from '../../logging/prefix-log-suffix';

export interface TapElectronLogOptions {
  /**
   * Logger that should be used
   */
  logger: Logger;
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

  const logFn = prefixLogSuffix(logger, prefixes, suffixes)[level];

  const logIO = withEmittedValues
    ? (...args: unknown[]) => logFn(...args)
    : logFn;

  return tap(logIO);
}
