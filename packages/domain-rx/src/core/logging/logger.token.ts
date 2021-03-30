import { createContextToken } from '@marblejs/core';
import { LogIO } from './logger.type';

/**
 * DI token for logging
 */
export const LogToken = createContextToken<LogIO>(`Log`);
