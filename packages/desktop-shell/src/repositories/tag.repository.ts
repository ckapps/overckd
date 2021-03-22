import { filterEndsWith } from '@ckapp/rxjs-snafu/lib/cjs/string/operators';
import { readDir, readFile, writeFile } from '@ckapp/rxjs-node-fs';
import { switchExpandItems } from '@ckapp/rxjs-snafu/lib/cjs/array/operators';
import { Context, createReader, useContext } from '@marblejs/core';
import { Ingredient } from '@overckd/domain';
import { TagRepository } from '@overckd/domain/dist/repositories';
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

export const TagFileRepository: Reader<Context, TagRepository> = createReader(
  ask => {
    const fakeTags = [
      {
        uri: '1',
        label: 'vegan',
      },
    ];

    const findByQuery: TagRepository['findByQuery'] = query => {
      const query$ = of(query);
      const items$ = of(...fakeTags);

      return items$.pipe(withLatestFrom(query$), asPagedResult());
    };

    return {
      findByQuery,
    };
  },
);
