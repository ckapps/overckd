import { RxDocument } from 'rxdb';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

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
