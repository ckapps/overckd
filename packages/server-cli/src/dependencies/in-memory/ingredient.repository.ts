import { switchExpandItems } from '@ckapp/rxjs-snafu/lib/cjs/array/operators';
import { Context, createReader } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';
import { Observable, of } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';

import { Ingredient, IngredientQuery, IngredientTag } from '@overckd/domain';
import { IngredientRepository } from '@overckd/domain/dist/repositories';
import { filterIngredientsByQuery } from '@overckd/domain/dist/rxjs/ingredient';
import { asPagedResult } from '@overckd/domain/dist/rxjs/search';
import { Page } from '@overckd/domain/dist/search';

import { UriFactory } from './utils';
import { InMemoryRepo } from './in-memory-repo';

const uri = UriFactory(['kitchen', 'ingredients']);

function makeIngredient(name: string, tags: IngredientTag[]): Ingredient {
  return {
    name,
    tags,
    uri: uri(name),
  };
}

class IngredientRepo
  extends InMemoryRepo<Ingredient>
  implements IngredientRepository {
  findByQuery(query: IngredientQuery): Observable<Page<Ingredient>> {
    const query$ = of(query);
    const items$ = this.all.pipe(take(1), switchExpandItems());

    return items$.pipe(
      withLatestFrom(query$),
      filterIngredientsByQuery(),
      asPagedResult(),
    );
  }

  equals(a: Ingredient, b: Ingredient): boolean {
    return a.name === b.name;
  }
}

export const MockIngredientRespository: Reader<
  Context,
  IngredientRepository
> = createReader<IngredientRepository>(() => {
  const initialValues = [
    makeIngredient('Flour', []),
    makeIngredient('Sugar', []),
    makeIngredient('Yeast', []),
    makeIngredient('Soy milk', []),
    makeIngredient('Almond milk', []),
  ];
  const repo = new IngredientRepo(initialValues);

  return {
    findByQuery: (...args) => repo.findByQuery(...args),
  };
});
