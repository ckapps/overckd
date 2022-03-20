import { mapItems } from '@ckapp/rxjs-snafu/lib/esm/array/operators';
import { OperatorFunction } from 'rxjs';

interface WithUri {
  uri?: string;
}

function extractUri(o: WithUri): string {
  return o.uri || '';
}

/**
 * @returns
 * Operator that maps all items to their URIs
 */
export function mapToUriArray<T extends WithUri>(): OperatorFunction<
  T[],
  string[]
> {
  return mapItems(extractUri);
}
