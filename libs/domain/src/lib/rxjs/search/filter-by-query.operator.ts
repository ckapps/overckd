import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DataQuery } from '../../search';

type QueryPredicateFn<T, TQ extends DataQuery<unknown>> = (
  data: [T, TQ],
  index: number,
) => boolean;

export function filterByQuery<T, TQ extends DataQuery<unknown>>(
  predicate: QueryPredicateFn<T, TQ>,
): MonoTypeOperatorFunction<[T, TQ]> {
  return filter(predicate);
}
