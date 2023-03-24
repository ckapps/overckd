import {
  bindEagerlyTo,
  bindLazilyTo,
  BoundDependency,
  ContextDependency,
} from '@marblejs/core';
import {
  IngredientRepositoryToken,
  LogToken,
  RecipeCollectionRepositoryToken,
  RecipeRepositoryToken,
  TagRepositoryToken,
} from '@overckd/domain-rx';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigReader, AppConfigToken } from './config/config.token';
import { configureDbDependencies } from './db/db';
import { CustomLoggerReader } from './logging/server-logger.dependency';
import {
  IngredientFileRepository,
  RecipeCollectionFileRespository,
  RecipeFileRespository,
  TagFileRepository,
} from './repositories';

type Dependencies = BoundDependency<unknown, ContextDependency>[];

export const configureDeps = (): Observable<Dependencies> => {
  return forkJoin({
    db: configureDbDependencies(),
  }).pipe(
    map(({ db }) => {
      return [
        // Dependency for the application configuration
        bindEagerlyTo(LogToken)(CustomLoggerReader),
        // Dependency for the application configuration
        bindEagerlyTo(AppConfigToken)(AppConfigReader),
        // Dependency for data storage
        ...db,
        // Dependencies for repositories
        bindLazilyTo(IngredientRepositoryToken)(IngredientFileRepository),
        bindLazilyTo(RecipeRepositoryToken)(RecipeFileRespository),
        bindLazilyTo(RecipeCollectionRepositoryToken)(
          RecipeCollectionFileRespository,
        ),
        bindLazilyTo(TagRepositoryToken)(TagFileRepository),
      ];
    }),
  );
};
