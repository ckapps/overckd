import { from, Observable } from 'rxjs';

import { readDir } from '../fs';

/**
 * An observable that emits with all files as an array, then completes.
 *
 * @param path
 */
export function fromDirectoryAsArray(path: string): Observable<string[]> {
  return from(readDir(path));
}
