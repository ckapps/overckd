import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { fromDirectoryAsArray } from './from-directory-as-array';

/**
 * An observable that emits for every file in the given
 * directory, then completes
 *
 * @param path Path to the directory
 */
export function fromDirectory(path: string): Observable<string> {
  return fromDirectoryAsArray(path).pipe(mergeMap(paths => of(...paths)));
}
