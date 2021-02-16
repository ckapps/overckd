import { isLeft, isRight } from 'fp-ts/lib/These';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

class DecodeError extends Error {
  name = 'DecodeError';
}

/**
 * Decodes an emitted value using the `codec`.
 *
 * @param codec Codec used for decoding
 */
export function codecDecode<T extends t.Mixed>(
  codec: T,
): OperatorFunction<T['_A'], T['_I']> {
  return map(c => {
    const r = codec.decode(c);

    if (isRight(r)) {
      return r.right;
    } else if (isLeft(r)) {
      throw new DecodeError(PathReporter.report(r).join('\n'));
    }
  });
}
