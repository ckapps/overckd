import { LogFunctions } from 'electron-log';

import { Logger } from '@overckd/domain';

/**
 * @param logger The log instance on which messages should be transformed
 * @param prefixes Array of args to prefix
 * @param suffixes Array of args to suffix
 *
 * @returns
 * A logger that prepends certain arguments on every message logged
 */
export function prefixLogSuffix(
  logger: Logger,
  prefixes: unknown[] = [],
  suffixes: unknown[] = [],
): Logger {
  const logFn = (fnName: keyof LogFunctions) => (...args: any[]) =>
    logger[fnName](...prefixes, ...args, ...suffixes);

  return {
    debug: logFn('debug'),
    error: logFn('error'),
    info: logFn('info'),
    log: logFn('log'),
    silly: logFn('silly'),
    verbose: logFn('verbose'),
    warn: logFn('warn'),
  };
}
