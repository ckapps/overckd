import { RxDocument } from 'rxdb';
import { map, OperatorFunction } from 'rxjs';

export function pluckData<T>(): OperatorFunction<
  RxDocument<T> | null,
  T | undefined
> {
  return map((doc: RxDocument<T> | null) =>
    doc ? doc.toMutableJSON() : undefined,
  );
}

export function pluckDataStrict<T>(): OperatorFunction<RxDocument<T>, T> {
  return map((doc: RxDocument<T>) => doc.toMutableJSON());
}
