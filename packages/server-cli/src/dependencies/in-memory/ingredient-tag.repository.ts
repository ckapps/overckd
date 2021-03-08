import { switchExpandItems } from '@ckapp/rxjs-snafu/lib/cjs/array/operators';
import { Context, createReader } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';
import { Observable, of } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';

import { IngredientTag, IngredientTagQuery } from '@overckd/domain';
import { IngredientTagRepository } from '@overckd/domain/dist/repositories';
import { filterIngredientTagsByQuery } from '@overckd/domain/dist/rxjs/ingredient-tag';
import { asPagedResult } from '@overckd/domain/dist/rxjs/search';
import { Page } from '@overckd/domain/dist/search';

import { UriFactory } from './utils';
import { InMemoryRepo } from './in-memory-repo';

const uri = UriFactory(['ingredients', 'tags']);

function makeIngredientTag(
  label: string,
  color?: string,
  icon?: string,
): IngredientTag {
  return {
    label,
    color,
    icon,
    uri: uri(label),
  };
}

class IngredientTagRepo
  extends InMemoryRepo<IngredientTag>
  implements IngredientTagRepository {
  findByQuery(query: IngredientTagQuery): Observable<Page<IngredientTag>> {
    const query$ = of(query);
    const items$ = this.all.pipe(take(1), switchExpandItems());

    return items$.pipe(
      withLatestFrom(query$),
      filterIngredientTagsByQuery(),
      asPagedResult(),
    );
  }

  equals(a: IngredientTag, b: IngredientTag): boolean {
    return a.uri === b.uri;
  }
}

export const MockIngredientTagRespository: Reader<
  Context,
  IngredientTagRepository
> = createReader<IngredientTagRepository>(() => {
  const initialValue = [
    makeIngredientTag('vegan', '#117935', 'leaf'),
    makeIngredientTag('vegetables', '#117935', 'leaf'),
    makeIngredientTag('fruit', '#117935', 'apple-alt'),
    makeIngredientTag('root vegetable', '#794c11', 'carrot'),
  ];
  const repo = new IngredientTagRepo(initialValue);

  return {
    findByQuery: (...args) => repo.findByQuery(...args),
  };
});
