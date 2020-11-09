import { BehaviorSubject, Observable, of, OperatorFunction } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export abstract class InMemoryRepo<T> {
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
    // return of(item).pipe
    return this.all.pipe(
      this.findItem2(item),
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
    return this.all.pipe(map(items => items.find(i => this.equals(i, item))));
  }

  findItem2(item: Partial<T>): OperatorFunction<T[], T | undefined> {
    return map(items => items.find(i => this.equals(i, item)));
  }

  abstract equals(a: T, b: Partial<T>): boolean;
}
