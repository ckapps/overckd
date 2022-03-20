import {
  bindEagerlyTo,
  ContextDependency,
  BoundDependency,
} from '@marblejs/core';

import { DbToken } from './db.token';
import { createDb } from './db.create';
import { configureDbCollectionDependencies } from '../collections/db.collections.create';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

type DbDependencies = BoundDependency<unknown, ContextDependency>[];

/**
 * Configures the dependencies for the DB submodule
 * @returns
 * Database dependencies
 */
export const configureDbDependencies = (): Observable<DbDependencies> => {
  const db$ = from(createDb());

  return db$.pipe(
    switchMap(db =>
      configureDbCollectionDependencies(db).pipe(
        map(dbCollectionDependencies => [
          // Dependency for database
          bindEagerlyTo(DbToken)(() => db),
          // And even more dependencies
          ...dbCollectionDependencies,
        ]),
      ),
    ),
  );
};
