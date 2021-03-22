import { filterEndsWith } from '@ckapp/rxjs-snafu/lib/cjs/string/operators';
import { readDir, readFile, writeFile } from '@ckapp/rxjs-node-fs';
import { switchExpandItems } from '@ckapp/rxjs-snafu/lib/cjs/array/operators';
import { Context, createReader, useContext } from '@marblejs/core';
import { Ingredient } from '@overckd/domain';
import { IngredientRepository } from '@overckd/domain/dist/repositories';
import { filterIngredientsByQuery } from '@overckd/domain/dist/rxjs/ingredient';
import { asPagedResult } from '@overckd/domain/dist/rxjs/search';
import { yamlDecode } from '@overckd/yaml-parser';
import { ingredientsFile } from '@overckd/yaml-parser/dist/file-codec';
import * as path from 'path';
import { Reader } from 'fp-ts/lib/Reader';

import { BehaviorSubject, from, Observable, of } from 'rxjs';
import {
  map,
  mergeMap,
  shareReplay,
  take,
  toArray,
  withLatestFrom,
} from 'rxjs/operators';
import { AppConfigToken } from '../config/config.token';
import { getPath, PathId } from '../paths';

function readAllIngredientFiles(dir: string) {
  return readDir(dir).pipe(
    mergeMap(paths => from(paths)),
    filterEndsWith('.ingredients.yaml'),
    map(filename => path.resolve(dir, filename)),
    mergeMap(path => readFile(path, { encoding: 'utf-8' })),
    yamlDecode(ingredientsFile),
    toArray(),
  );
}

export const IngredientFileRepository: Reader<
  Context,
  IngredientRepository
> = createReader(ask => {
  const { paths } = useContext(AppConfigToken)(ask);

  const ingredientsFolder = getPath(PathId.Ingredients);

  const ingredients$ = readAllIngredientFiles(ingredientsFolder).pipe(
    shareReplay(1),
  );

  const findByQuery: IngredientRepository['findByQuery'] = query => {
    const query$ = of(query);
    const items$ = ingredients$.pipe(take(1), switchExpandItems());

    return items$.pipe(
      withLatestFrom(query$),
      filterIngredientsByQuery(),
      asPagedResult(),
    );
  };

  return {
    findByQuery,
  };
});
