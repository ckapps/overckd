import { ApplicationShell } from './application-shell.enum';
import type { FrontendEnvironment } from './environment.type';

/**
 * Configuration used for the desktop application.
 */
export const environment: FrontendEnvironment = {
  production: false,
  shell: ApplicationShell.Desktop,
  legacyApiUrl: '/api',
  api: {
    /** The API origin: the Electron main process. */
    url: 'overckd://app',
  },
};
