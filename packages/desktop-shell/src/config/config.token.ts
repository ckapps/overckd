import { createReader, createContextToken } from '@marblejs/core';

import { AppConfig } from './app-config.types';

// ----------------------------------------------------------------------------
// Repositories
// ----------------------------------------------------------------------------
/**
 * DI token for recipe collection repository
 */
export const AppConfigToken = createContextToken<AppConfig>('AppConfig');

export const AppConfigReader = createReader<AppConfig>(
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  () => require('./config').config,
);
