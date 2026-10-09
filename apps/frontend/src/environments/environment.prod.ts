import { ApplicationShell } from './application-shell.enum';
import { FrontendEnvironment } from './environment.type';

export const environment: FrontendEnvironment = {
  production: true,
  shell: ApplicationShell.Web,
  api: {
    url: '',
  },
};
