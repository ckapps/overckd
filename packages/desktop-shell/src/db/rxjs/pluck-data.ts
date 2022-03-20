import { RxDocument } from 'rxdb';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function pluckData<T>(): OperatorFunction<
  RxDocument<T> | null,
  T | undefined
> {
  return map((x: RxDocument<T> | null) => (x ? x.toJSON() : undefined));
}

export function pluckDataStrict<T>(): OperatorFunction<RxDocument<T>, T> {
  return map((x: RxDocument<T>) => x.toJSON());
}
