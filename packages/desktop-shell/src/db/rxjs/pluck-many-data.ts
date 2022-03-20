import { RxDocument } from 'rxdb';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function pluckManyData<T>(): OperatorFunction<RxDocument<T>[], T[]> {
  return map((x: RxDocument<T>[]) => x.map(y => y.toJSON()));
}
