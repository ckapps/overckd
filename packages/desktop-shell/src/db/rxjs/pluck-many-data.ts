import { RxDocument } from 'rxdb';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function pluckManyData<T>(): OperatorFunction<RxDocument<T>[], T[]> {
  return map((docs: RxDocument<T>[]) => docs.map(doc => doc.toMutableJSON()));
}
