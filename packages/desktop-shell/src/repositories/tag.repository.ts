import { filterEndsWith } from '@ckapp/rxjs-snafu/lib/cjs/string/operators';
import { readDir, readFile, appendFile } from '@ckapp/rxjs-node-fs';
import { switchExpandItems } from '@ckapp/rxjs-snafu/lib/cjs/array/operators';
import { Context, createReader, useContext } from '@marblejs/core';
import { Tag } from '@overckd/domain';
import { TagRepository } from '@overckd/domain/dist/repositories';
import { filterTagsByQuery } from '@overckd/domain/dist/rxjs/tag';
import { asPagedResult } from '@overckd/domain/dist/rxjs/search';
import { yamlDecode, yamlEncode } from '@overckd/yaml-parser';
import { tagsFile } from '@overckd/yaml-parser/dist/file-codec';
import * as path from 'path';
import { Reader } from 'fp-ts/lib/Reader';

import { BehaviorSubject, from, of, OperatorFunction } from 'rxjs';
import {
  map,
  mapTo,
  mergeMap,
  reduce,
  shareReplay,
  take,
  tap,
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
    const allTags = new BehaviorSubject<Tag[]>([]);
    const allTags$ = readAllTagFiles(tagsFolder).pipe(
      tap(tags => allTags.next(tags)),
      shareReplay(1),
    );

    const findByQuery: TagRepository['findByQuery'] = query => {
      const query$ = of(query);
      const items$ = allTags$.pipe(take(1), switchExpandItems());

      return items$.pipe(
        withLatestFrom(query$),
        filterTagsByQuery(),
        asPagedResult(),
      );
    };

    const getByUri: TagRepository['getByUri'] = uri =>
      allTags$.pipe(map(f => f.find(c => c.uri === uri)));

    return {
      findByQuery,
      getByUri,
      add: tag =>
        of(tag).pipe(
          mergeMap(r => {
            const filename = path.resolve(tagsFolder, `custom.tags.yaml`);

            // Encode for saving
            return of(tag).pipe(
              yamlEncode(tagsFile),
              // Now save the tag
              mergeMap(fileContent =>
                appendFile(filename, fileContent, {
                  encoding: 'utf8',
                  flag: 'a',
                }),
              ),
              mapTo(r),
            );
          }),
          tap(c => allTags.next([...allTags.value, c])),
        ),
      removeByUri: uri =>
        getByUri(uri).pipe(
          map(x => {
            if (x === undefined) {
              return false;
            }

            const indexOfItem = allTags.value.indexOf(x);
            allTags.next(allTags.value.filter((_, i) => i !== indexOfItem));
            return true;
          }),
        ),
      update: (r, name) => {
        throw new Error('Method not implemented.');
      },
    };
  },
);
