import { OperatorFunction } from 'rxjs';
import { reduce } from 'rxjs/operators';

import { DataQuery, Page } from '../../search';

/**
 * @param defaultPageSize The default page size
 *
 * @returns
 * Operator that collects items until the requested
 * page is filled and then emits and completes.
 */
export function asPagedResult<T, TQ extends DataQuery<unknown>>(
  defaultPageSize = 50,
): OperatorFunction<[T, TQ], Page<T>> {
  return obs$ =>
    obs$.pipe(
      reduce(
        (acc, [item, query], index) => {
          const { page = 0, size = defaultPageSize } = query;

          const startIndex = page * size;
          const endIndex = (page + 1) * size;

          const result =
            startIndex <= index && index < endIndex
              ? [...acc.result, item]
              : acc.result;

          return {
            ...acc,
            result,
            page,
            size,
            count: index + 1,
          };
        },
        { result: [], page: 0, size: defaultPageSize, count: 0 } as Page<T>,
      ),
    );
}
