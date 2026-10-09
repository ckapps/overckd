// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { ApplicationShell } from './application-shell.enum';
import { FrontendEnvironment } from './environment.type';

export const environment: FrontendEnvironment = {
  production: false,
  shell: ApplicationShell.Web,
  legacyApiUrl: '/api',
  api: {
    url: '',
  },
};
