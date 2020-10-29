/* eslint-disable @typescript-eslint/ban-types */

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as yaml from 'js-yaml';

import { fromFile } from './from-file';

export function fromYamlFile<T>(
  filename: string,
  opts?: yaml.LoadOptions,
): Observable<T>;

export function fromYamlFile(
  filename: string,
  opts?: yaml.LoadOptions,
): Observable<string | object | undefined>;

export function fromYamlFile(
  filename: string,
  opts: yaml.LoadOptions = {},
): Observable<string | object | undefined> {
  return fromFile(filename).pipe(
    map(fileContent => yaml.safeLoad(fileContent, { ...opts, filename })),
  );
}
