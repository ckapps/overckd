import { DataQuery } from '@overckd/domain';

type FlattenQuery<T> = Pick<DataQuery<T>, 'page' | 'size'> & T;

/**
 * Takes parameters and transforms them into a data query
 *
 * @param params Parameters
 * @returns
 */
export function unflattenQuery<T>(params: FlattenQuery<T>): DataQuery<T> {
  const { size, page, ...query } = params;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return { size, page, query };
}
