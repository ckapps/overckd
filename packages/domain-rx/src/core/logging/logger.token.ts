import { createContextToken } from '@marblejs/core';
import { LogIO, LoggerOptions } from '@ckapp/rxjs-snafu/lib/cjs/log';

/**
 * DI token for logging
 */
export const LogToken = createContextToken<LogIO>(`Log`);

export { LogIO, LoggerOptions };
