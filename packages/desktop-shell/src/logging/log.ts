import * as log from 'electron-log';

/**
 * Creates a new scoped logger
 *
 * @param scope Logger scope
 *
 * @returns
 */
export function scoped<T extends string>(scope: T): log.LogFunctions {
  return log.scope(scope);
}

export { log };
