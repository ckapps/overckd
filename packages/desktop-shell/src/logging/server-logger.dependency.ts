import { LogLevel } from '@ckapp/rxjs-snafu/lib/cjs/log';
import { createReader } from '@marblejs/core';
import { LogIO } from '@overckd/domain-rx/dist/core/logging';

import { scoped } from './log';

const logger = scoped('domain-rx');

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

  const _log = logger[level];

  return withArguments
    ? (...args) => _log(...prefixes, message, ...args, ...suffixes)
    : () => _log(...prefixes, message, ...suffixes);
});
