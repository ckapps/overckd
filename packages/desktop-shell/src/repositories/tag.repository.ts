import { filterEndsWith } from '@ckapp/rxjs-snafu/lib/cjs/string/operators';
import { readDir, readFile, writeFile } from '@ckapp/rxjs-node-fs';
import { switchExpandItems } from '@ckapp/rxjs-snafu/lib/cjs/array/operators';
import { Context, createReader, useContext } from '@marblejs/core';
import { Tag } from '@overckd/domain';
import { TagRepository } from '@overckd/domain/dist/repositories';
import { filterTagsByQuery } from '@overckd/domain/dist/rxjs/tag';
import { asPagedResult } from '@overckd/domain/dist/rxjs/search';
import { yamlDecode } from '@overckd/yaml-parser';
import { tagsFile } from '@overckd/yaml-parser/dist/file-codec';
import * as path from 'path';
import { Reader } from 'fp-ts/lib/Reader';

import { from, of, OperatorFunction } from 'rxjs';
import {
  map,
  mergeMap,
  reduce,
  shareReplay,
  take,
  withLatestFrom,
} from 'rxjs/operators';
import { AppConfigToken } from '../config/config.token';
import { getPath, PathId } from '../paths';

function readAllTagFiles(dir: string) {
  return readDir(dir).pipe(
    mergeMap(paths => from(paths)),
    filterEndsWith('.tags.yaml'),
    map(filename => path.resolve(dir, filename)),
    mergeMap(path => readFile(path, { encoding: 'utf-8' })),
    yamlDecode(tagsFile),
    reduceTags(),
  );
}

function reduceTags(): OperatorFunction<Tag[], Tag[]> {
  return reduce((acc, cur) => [...acc, ...cur], [] as Tag[]);
}

export const TagFileRepository: Reader<Context, TagRepository> = createReader(
  ask => {
    const { paths } = useContext(AppConfigToken)(ask);

    const tagsFolder = getPath(PathId.Tags);
    const allTags$ = readAllTagFiles(tagsFolder).pipe(shareReplay(1));

    const findByQuery: TagRepository['findByQuery'] = query => {
      const query$ = of(query);
      const items$ = allTags$.pipe(take(1), switchExpandItems());

      return items$.pipe(
        withLatestFrom(query$),
        filterTagsByQuery(),
        asPagedResult(),
      );
    };

    return {
      findByQuery,
    };
  },
);
