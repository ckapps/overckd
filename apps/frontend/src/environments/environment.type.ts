import type { ApiConfig } from '../app/config/api.config';
import type { ApplicationShell } from './application-shell.enum';

export type FrontendEnvironment = Readonly<{
  production: boolean;
  shell: ApplicationShell;
  api: ApiConfig;
  /**
   * The base URL of the legacy services (`UrlBuilderService`).
   *
   * @deprecated
   */
  legacyApiUrl: string;
}>;
