import {
  bindEagerlyTo,
  BoundDependency,
  ContextDependency,
} from '@marblejs/core';
import { from, map, Observable, switchMap } from 'rxjs';
import { configureDbCollectionDependencies } from '../collections/db.collections.create';
import { createDb } from './db.create';
import { DbToken } from './db.token';

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
