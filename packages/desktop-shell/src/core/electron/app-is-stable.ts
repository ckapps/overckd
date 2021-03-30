import { LogLevel } from '@overckd/domain';
import * as log from 'electron-log';
import { Observable } from 'rxjs';
import { mergeMap, shareReplay } from 'rxjs/operators';
import { appIsReady$ } from './app-is-ready';

import { ElectronLogScope } from './electron.log-scope';
import { logEnterExit } from './log-enter-exit';

const logger = log.scope(ElectronLogScope.App);

/**
 * @param observableFactory
 * Factory that creates an observable that should emit and complete
 * when the app is stabilized.
 *
 * @returns
 */
export function appIsStable$<T>(
  observableFactory: () => Observable<T>,
): Observable<T> {
  return appIsReady$.pipe(
    mergeMap(observableFactory),
    logEnterExit('stabilizing', { logger, level: LogLevel.Verbose }),
    shareReplay(1),
  );
}
