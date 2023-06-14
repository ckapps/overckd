import { ServerConfig } from './server-config.types';

// TODO: Remove
const overrideWithDevDefaults = {
  port: 4201,
};

/**
 * Default configuration for server
 */
export const defaultServerConfig: ServerConfig = {
  // Use dynamic port per default
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // TODO: remove
  port: 0,
  paths: {
    images: './images',
  },
  ...overrideWithDevDefaults,
};
