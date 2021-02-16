import * as t from 'io-ts';
import * as yaml from 'js-yaml';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { codecEncode } from './codec-encode';

/**
 * Encodes an emitted value using the given `codec`
 * and converts it to yaml format.
 *
 * @param codec Codec to use for encoding
 * @param options YAML format options
 */
export function yamlEncode<T extends t.Mixed>(
  codec: T,
  options?: yaml.DumpOptions,
): OperatorFunction<unknown, string> {
  return obs$ =>
    obs$.pipe(
      codecEncode(codec),
      map(c => yaml.safeDump(c, options)),
    );
}
