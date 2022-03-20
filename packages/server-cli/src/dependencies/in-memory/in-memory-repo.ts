import { BehaviorSubject, Observable, of, OperatorFunction } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import {
  DataQuery,
  Page,
  PagingInformation,
} from '@overckd/domain/dist/search';

/**
 * Basic implementation for an in memory repository
 */
export abstract class InMemoryRepo<T, TQuery = any> {
  protected all: BehaviorSubject<T[]>;

  constructor(protected initialValue: T[] = []) {
    this.all = new BehaviorSubject(initialValue);
  }

  _add(item: T): Observable<T> {
    return of(item).pipe(tap(i => this.all.next([...this.all.value, i])));
  }

  _remove(item: Partial<T>): Observable<boolean> {
    return this.findItem(item).pipe(
      map(x => {
        if (x === undefined) {
          return false;
        }

        const indexOfItem = this.all.value.indexOf(x);
        this.all.next(this.all.value.filter((_, i) => i !== indexOfItem));
        return true;
      }),
    );
  }

  _update(item: T): Observable<T | undefined> {
    return this.all.pipe(
      this.findItemOperator(item),
      tap(x => {
        if (x) {
          const indexOfItem = this.all.value.indexOf(x);
          this.all.next(
            this.all.value.map((x, i) => (i === indexOfItem ? item : x)),
          );
        }
      }),
    );
  }

  findItem(item: Partial<T>): Observable<T | undefined> {
    return this.all.pipe(this.findItemOperator(item));
  }

  findItemOperator(item: Partial<T>): OperatorFunction<T[], T | undefined> {
    return map(items => items.find(i => this.equals(i, item)));
  }

  findByQuery(query: DataQuery<TQuery>): Observable<Page<T>> {
    throw new Error('Not implemented');
  }

  abstract equals(a: T, b: Partial<T>): boolean;
}
