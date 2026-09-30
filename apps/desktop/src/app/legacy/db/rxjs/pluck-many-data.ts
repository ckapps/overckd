import { RxDocument } from 'rxdb';
import { map, OperatorFunction } from 'rxjs';

export function pluckManyData<T>(): OperatorFunction<RxDocument<T>[], T[]> {
  return map((docs: RxDocument<T>[]) => docs.map(doc => doc.toMutableJSON()));
}
