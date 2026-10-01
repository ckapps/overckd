import {
  bindEagerlyTo,
  contextFactory,
  createReader,
  lookup,
} from '@marblejs/core';
import { RecipeId, RecipeNotFound } from '@overckd/domain-experimental';
import { RecipeRepo } from '@overckd/recipe/application';
import { Effect } from 'effect';
import { of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { MarbleJsContextProvider } from '../../shared/marble-context-provider';
import { RecipeRepositoryToken } from '../models.tokens';
import { RecipeRepoMarbleInterop } from './recipe.model';

const pancakes = {
  name: 'Pancakes',
  ingredients: [{ amount: 200, unit: 'g', name: 'Flour' }],
  steps: ['Mix and fry'],
  tips: [],
  images: [],
  styles: {},
};

const LegacyRecipeRepository = createReader(() => ({
  getByName: (name: string) =>
    of(name === pancakes.name ? pancakes : undefined),
}));

const run = <A, E>(effect: Effect.Effect<A, E, RecipeRepo>) =>
  Effect.runPromise(
    Effect.promise(() =>
      contextFactory(
        bindEagerlyTo(RecipeRepositoryToken)(LegacyRecipeRepository),
      ),
    ).pipe(
      Effect.flatMap(context =>
        effect.pipe(
          Effect.provide(RecipeRepoMarbleInterop),
          Effect.provideService(MarbleJsContextProvider, lookup(context)),
        ),
      ),
    ),
  );

describe('RecipeRepoMarbleInterop', () => {
  it('finds a legacy recipe by its name', async () => {
    const recipe = await run(
      RecipeRepo.use(repo => repo.findById(RecipeId.make('Pancakes'))),
    );

    expect(recipe).toMatchObject({
      _tag: 'BasicRecipePreparation',
      id: 'Pancakes',
      name: 'Pancakes',
      steps: [{ instruction: 'Mix and fry' }],
    });
  });

  it('fails with RecipeNotFound for unknown names', async () => {
    const error = await run(
      RecipeRepo.use(repo => repo.findById(RecipeId.make('Bread'))).pipe(
        Effect.flip,
      ),
    );

    expect(error).toBeInstanceOf(RecipeNotFound);
  });
});
