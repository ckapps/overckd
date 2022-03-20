import { DataQuery } from '@overckd/domain/dist/search';
import { unflattenQuery } from '@overckd/domain-rx/dist/search';
import { OperatorFunction } from 'rxjs';
import { pluck, map } from 'rxjs/operators';

import { mapPaginationTyped, FromQueryString } from '../pagination';

import { HttpRequest } from '@marblejs/core';

/**
 * Utility function for transform from request properties
 *
 * @param property Property to extract information from
 *
 * @returns
 */
export function transformFromRequestProperty<
  TBody = unknown,
  TParams = unknown,
  TQuery extends Record<string, unknown> = Record<string, unknown>
>(
  property: 'query',
): OperatorFunction<
  HttpRequest<TBody, TParams, FromQueryString<TQuery>>,
  DataQuery<TQuery>
> {
  return obs$ =>
    obs$.pipe(
      // Extract the requested property
      pluck(property),
      // Map pagination information
      mapPaginationTyped(),
      // Unwrap
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      map<unknown, DataQuery<TQuery>>(unflattenQuery),
    );
}
