import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export type FromQueryString<T> = T & {
  page?: string;
  size?: string;
};

type QueryString = {
  page?: number;
  size?: number;
};

/**
 * Maps pagination information
 *
 * @returns
 */
export function mapPaginationTyped(): OperatorFunction<
  FromQueryString<Record<string, unknown>>,
  QueryString & Record<string, unknown>
> {
  return map(({ size, page, ...others }) => ({
    size: size ? Number.parseInt(size) : undefined,
    page: page ? Number.parseInt(page) : undefined,
    ...others,
  }));
}
