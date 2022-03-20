import { readDir, readFile } from '@ckapp/rxjs-node-fs';
import { filterEndsWith } from '@ckapp/rxjs-snafu/lib/cjs/string/operators';
import { Tag } from '@overckd/domain';
import { yamlDecode } from '@overckd/yaml-parser';
import { tagsFile } from '@overckd/yaml-parser/dist/file-codec';
import * as path from 'path';
import { OperatorFunction, from, Observable } from 'rxjs';
import { reduce, mergeMap, map } from 'rxjs/operators';

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
