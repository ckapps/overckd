import {
  IngredientId,
  NonEmptyHtmlString,
  RecipeId,
  RecipeIngredient,
  RecipeNotFound,
  RecipePreparation,
} from '@overckd/domain';
import { RecipeRepo } from '@overckd/recipe/application';
import { Effect, Layer, Option } from 'effect';
import { describe, expect, it } from 'vitest';

const flour = RecipeIngredient.make({
  uri: IngredientId.make('flour'),
  name: 'Flour',
  amount: Option.none(),
  optional: false,
  alternatives: [],
});

const pancakes: RecipePreparation = {
  _tag: 'BasicRecipePreparation',
  id: RecipeId.make('pancakes'),
  name: 'Pancakes',
  tips: [],
  basedOn: [],
  ingredients: [flour],
  portion: { kind: 'quantity', label: Option.none(), quantity: 4 },
  steps: [{ instruction: NonEmptyHtmlString.make('Mix and fry') }],
  stepsEnumerated: false,
  images: [],
};

const bread: RecipePreparation = {
  _tag: 'BasicRecipePreparation',
  id: RecipeId.make('bread'),
  name: 'Bread',
  tips: [],
  basedOn: [],
  ingredients: [flour],
  portion: { kind: 'quantity', label: Option.none(), quantity: 1 },
  steps: [{ instruction: NonEmptyHtmlString.make('Knead and bake') }],
  stepsEnumerated: false,
  images: [],
};

/**
 * Registers the tests every `RecipeRepo` implementation must pass.
 * @param makeRepo Builds the repository, holding the given recipes
 */
export const recipeRepoConformance = (
  makeRepo: (seed: ReadonlyArray<RecipePreparation>) => Layer.Layer<RecipeRepo>,
) => {
  const run = <A, E>(
    seed: ReadonlyArray<RecipePreparation>,
    effect: Effect.Effect<A, E, RecipeRepo>,
  ) => Effect.runPromise(effect.pipe(Effect.provide(makeRepo(seed))));

  describe('RecipeRepo conformance', () => {
    it('finds a recipe by its id', async () => {
      const found = await run(
        [pancakes, bread],
        RecipeRepo.use(repo => repo.findById(bread.id)),
      );
      expect(found).toEqual(bread);
    });

    it('fails with RecipeNotFound for unknown ids', async () => {
      const error = await run(
        [pancakes],
        RecipeRepo.use(repo => repo.findById(RecipeId.make('nope'))).pipe(
          Effect.flip,
        ),
      );
      expect(error).toBeInstanceOf(RecipeNotFound);
    });

    it('fails with RecipeNotFound when it holds no recipes', async () => {
      const error = await run(
        [],
        RecipeRepo.use(repo => repo.findById(pancakes.id)).pipe(Effect.flip),
      );
      expect(error).toBeInstanceOf(RecipeNotFound);
    });
  });
};
