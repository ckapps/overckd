import { HttpRequest } from '@marblejs/http';
import { DataQuery } from '@overckd/domain';
import { unflattenQuery } from '@overckd/domain-rx';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { FromQueryString, mapPaginationTyped } from '../pagination';

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
  TQuery extends Record<string, unknown> = Record<string, unknown>,
>(
  property: 'query',
): OperatorFunction<
  HttpRequest<TBody, TParams, FromQueryString<TQuery>>,
  DataQuery<TQuery>
> {
  return obs$ =>
    obs$.pipe(
      // Extract the requested property
      map(value => value?.[property]),
      // Map pagination information
      mapPaginationTyped(),
      // Unwrap
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      map<unknown, DataQuery<TQuery>>(unflattenQuery),
    );
}
