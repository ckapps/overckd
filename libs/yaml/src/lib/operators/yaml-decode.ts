import * as t from 'io-ts';
import * as yaml from 'js-yaml';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { codecDecode } from './codec-decode';

/**
 * Parses an emitted string as YAML and decodes it
 * using the given `codec`.
 *
 * @param codec Codec to use for decoding
 * @param options YAML format options
 */
export function yamlDecode<T extends t.Mixed>(
  codec: T,
  options?: yaml.LoadOptions,
): OperatorFunction<string, T['_A']> {
  return obs$ =>
    obs$.pipe(
      map(fileContent => yaml.safeLoad(fileContent, options)),
      codecDecode(codec),
    );
}
