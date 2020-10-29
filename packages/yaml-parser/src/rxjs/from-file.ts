import { from, Observable } from 'rxjs';

import { readFile } from '../fs';

export function fromFile(filepath: string): Observable<string> {
  return from(readFile(filepath, { encoding: 'utf8' }));
}
