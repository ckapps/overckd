import { LogLevel } from '@overckd/domain';
import { Observable } from 'rxjs';
import { mergeMap, shareReplay } from 'rxjs/operators';

import { ElectronLogScope, scoped } from '../../logging';
import { appIsReady$ } from './app-is-ready';
import { logEnterExit } from './log-enter-exit';

const logger = scoped(ElectronLogScope.App);

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
