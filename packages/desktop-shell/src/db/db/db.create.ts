import {
  LogLevel,
  logEnterExit,
} from '@ckapp/rxjs-snafu/lib/cjs/log/operators';
import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';
import { from, Observable } from 'rxjs';

import { scoped, DbLogScope } from '../../logging';

const logger = scoped(DbLogScope.Db);

/**
 * Creates a new database
 *
 * @returns
 */
export function createDb(): Observable<RxDatabase> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  addRxPlugin(require('pouchdb-adapter-memory'));

  // Return created database
  return from(
    createRxDatabase({
      name: 'overckd_local',
      adapter: 'memory',
    }),
  ).pipe(logEnterExit('Creating DB', { logger, level: LogLevel.Silly }));
}
