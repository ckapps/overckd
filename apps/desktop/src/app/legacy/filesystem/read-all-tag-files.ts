import { readDir, readFile } from '@ckapp/rxjs-node-fs';
import { filterEndsWith } from '@ckapp/rxjs-snafu/lib/cjs/string/operators';
import { Tag } from '@overckd/domain';
import { tagsFile, yamlDecode } from '@overckd/yaml';
import * as path from 'path';
import {
  from,
  map,
  mergeMap,
  Observable,
  OperatorFunction,
  reduce,
} from 'rxjs';

function reduceTags(): OperatorFunction<Tag[], Tag[]> {
  return reduce((acc, cur) => [...acc, ...cur], [] as Tag[]);
}

/**
 * @param dir
 * Path to directory
 *
 * @returns
 */
export function readAllTagFiles(dir: string): Observable<Tag[]> {
  return readDir(dir).pipe(
    mergeMap(paths => from(paths)),
    filterEndsWith('.tags.yaml'),
    map(filename => path.resolve(dir, filename)),
    mergeMap(path => readFile(path, { encoding: 'utf-8' })),
    yamlDecode(tagsFile),
    reduceTags(),
  );
}
