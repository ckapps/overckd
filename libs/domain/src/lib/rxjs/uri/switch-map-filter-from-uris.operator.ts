import * as Arr from 'effect/Array';
import * as O from 'effect/Option';
import { combineLatest, MonoTypeOperatorFunction, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface WithUri {
  uri?: string;
}

/**
 * @param selection$ Stream of selected URIs
 *
 * @returns
 * Operator that filters all items of an emitted stream
 * by comparing the items against an provided stream
 * of selections.
 */
export function switchMapFilterFromUris<T extends WithUri>(
  selection$: Observable<string[]>,
): MonoTypeOperatorFunction<T[]> {
  return switchMap(receivedTags =>
    combineLatest([of(receivedTags), selection$]).pipe(
      switchMap(([tags, selectedTagUris]) =>
        of(
          Arr.filter(tags, ({ uri }) =>
            O.isSome(
              Arr.findFirst(selectedTagUris, selected => selected === uri),
            ),
          ),
        ),
      ),
    ),
  );
}
