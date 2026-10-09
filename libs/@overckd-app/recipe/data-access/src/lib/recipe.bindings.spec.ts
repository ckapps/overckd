import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideEffectRuntime } from '@ckapp/angular-effect';
import {
  IngredientId,
  NonEmptyHtmlString,
  RecipeFindByIdPayload,
  RecipeId,
  RecipeIngredient,
  RecipeNotFound,
  RecipePreparation,
} from '@overckd/domain';
import { RecipeQueries } from '@overckd/recipe/application';
import { Effect, Layer, Option } from 'effect';
import { beforeEach, describe, expect, it } from 'vitest';
import { injectRecipeQueries } from './recipe.bindings';

const pancakes: RecipePreparation = {
  _tag: 'BasicRecipePreparation',
  id: RecipeId.make('Pancakes'),
  name: 'Pancakes',
  tips: [],
  basedOn: [],
  ingredients: [
    RecipeIngredient.make({
      uri: IngredientId.make('flour'),
      name: 'Flour',
      amount: Option.none(),
      optional: false,
      alternatives: [],
    }),
  ],
  portion: { kind: 'quantity', label: Option.none(), quantity: 4 },
  steps: [{ instruction: NonEmptyHtmlString.make('Mix and fry') }],
  stepsEnumerated: false,
  images: [],
};

const findPancakes = ({ id }: RecipeFindByIdPayload) =>
  id === pancakes.id
    ? Effect.succeed(pancakes)
    : Effect.fail(new RecipeNotFound({ id }));

const stable = () => TestBed.inject(ApplicationRef).whenStable();

describe('injectRecipeQueries', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideEffectRuntime(
          Layer.mock(RecipeQueries, { findById: findPancakes }),
        ),
      ],
    });
  });

  it('stays idle while an input is undefined, then loads', async () => {
    const payload = signal<RecipeFindByIdPayload | undefined>(undefined);
    const recipe = TestBed.runInInjectionContext(() =>
      injectRecipeQueries().findById(payload),
    );
    await stable();
    expect(recipe.status()).toBe('idle');

    payload.set({ id: pancakes.id });
    await stable();
    expect(recipe.value()?.name).toBe('Pancakes');
  });

  it('shows RecipeNotFound as the resource error', async () => {
    const recipe = TestBed.runInInjectionContext(() =>
      injectRecipeQueries().findById(signal({ id: RecipeId.make('nope') })),
    );
    await stable();
    expect(recipe.status()).toBe('error');
    expect(recipe.error()).toBeInstanceOf(RecipeNotFound);
  });
});
