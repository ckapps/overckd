import { createContextToken } from '@marblejs/core';

import { ServerConfig } from './config';

/**
 * DI token for server configuration
 */
export const ServerConfigToken =
  createContextToken<ServerConfig>('ServerConfig');
