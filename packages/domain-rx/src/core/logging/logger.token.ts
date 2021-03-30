import { createContextToken } from '@marblejs/core';
import { LogIO, LoggerOptions } from '@overckd/domain/dist/logging/log-io.type';

/**
 * DI token for logging
 */
export const LogToken = createContextToken<LogIO>(`Log`);

export { LogIO, LoggerOptions };
