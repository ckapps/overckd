import {
  Logger,
  LogLevel,
  prefixLogSuffix,
} from '@ckapp/rxjs-snafu/lib/cjs/log';
import { createReader } from '@marblejs/core';
import { LogIO } from '@overckd/domain-rx/dist/core/logging';

const baseLogger: Logger = {
  debug: (...args) => console.debug(...args),
  error: (...args) => console.error(...args),
  info: (...args) => console.info(...args),
  log: (...args) => console.log(...args),
  silly: (...args) => console.info(...args),
  verbose: (...args) => console.info(...args),
  warn: (...args) => console.warn(...args),
};

const logger = prefixLogSuffix(baseLogger, ['domain-rx']);

/**
 * Custom logger for marblejs
 */
export const CustomLoggerReader = createReader<LogIO>(() => opts => {
  const {
    message = '',
    level = LogLevel.Info,
    prefixes = [],
    suffixes = [],
    withArguments = true,
  } = opts;

  const _log = prefixLogSuffix(logger, prefixes, suffixes)[level];

  return withArguments
    ? (...args) => _log(message, ...args)
    : () => _log(message);
});
