import { app } from 'electron';
import * as log from 'electron-log';
import { from } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

import { ElectronLogScope } from './electron.log-scope';

const logger = log.scope(ElectronLogScope.App);

/**
 * Emits and completes when electron is initialized.
 */
export const appIsReady$ = from(app.whenReady()).pipe(
  tap(() => logger.verbose('is ready')),
  shareReplay(1),
);
