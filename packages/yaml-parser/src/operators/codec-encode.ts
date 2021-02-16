import * as t from 'io-ts';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Encodes an emitted value using the `codec`.
 *
 * @param codec Codec to use for encoding
 */
export function codecEncode<T extends t.Mixed>(
  codec: T,
): OperatorFunction<T['_A'], T['_O']> {
  return map(c => codec.encode(c));
}
