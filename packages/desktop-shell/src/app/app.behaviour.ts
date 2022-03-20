import { fromAppEvent } from '@ckapp/rxjs-electron/lib/app';
import { platform$ } from '@ckapp/rxjs-node-process';
import { filterNotOnPlatforms } from '@ckapp/rxjs-node-process/lib/operators';
import { app, BrowserWindow } from 'electron';
import { merge, Observable } from 'rxjs';
import { filter, switchMapTo, tap } from 'rxjs/operators';

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
const windowAllClosed$ = fromAppEvent('window-all-closed').pipe(
  switchMapTo(platform$),
  filterNotOnPlatforms(['darwin']),
  tap(() => app.quit()),
);

// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
function activate$(createWindow: () => void) {
  return fromAppEvent('activate').pipe(
    filter(() => BrowserWindow.getAllWindows().length === 0),
    tap(createWindow),
  );
}

/**
 * Creates a default app behaviour middleware
 *
 * @param createWindow Method for creating windows
 *
 * @returns
 * Stream of events
 */
export function defaultAppBehaviour(
  createWindow: () => void,
): Observable<unknown> {
  return merge(windowAllClosed$, activate$(createWindow));
}
