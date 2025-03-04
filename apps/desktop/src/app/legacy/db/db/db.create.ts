import {
  logEnterExit,
  LogLevel,
} from '@ckapp/rxjs-snafu/lib/cjs/log/operators';
import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { concatMap, defer, from, Observable } from 'rxjs';
import { DbLogScope, scoped } from '../../logging';

const logger = scoped(DbLogScope.Db);

/**
 * Creates a new database
 *
 * @returns
 */
export function createDb(): Observable<RxDatabase> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  addRxPlugin(RxDBQueryBuilderPlugin);

  const createDb$ = defer(() => {
    return from(
      createRxDatabase({
        name: 'overckd_local',
        storage: getRxStorageMemory(),
      }),
    );
  }).pipe(logEnterExit('Creating DB', { logger, level: LogLevel.Silly }));

  const preCreate$ = defer(() => {
    return from(preCreate());
  });

  // Return created database
  return preCreate$.pipe(concatMap(() => createDb$));
}

async function preCreate() {
  // TODO(dev): Use args.dev??
  if (process.env.NODE_ENV !== 'production') {
    const { RxDBDevModePlugin } = await import('rxdb/plugins/dev-mode');
    addRxPlugin(RxDBDevModePlugin);
  }
}
