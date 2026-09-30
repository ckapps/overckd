import { t } from '@marblejs/middleware-io';

// ----------------------------------------------------------------------------
// Consts
// ----------------------------------------------------------------------------

export const CollectionRecipeDto = t.type({
  id: t.string,
  name: t.string,
});

export const RecipeCollectionDto = t.type({
  id: t.string,
  name: t.string,
  description: t.string,
  //   recipes: t.array(t.union([t.literal('ADMIN'), t.literal('GUEST')])),
  recipes: t.array(CollectionRecipeDto),
});

export const RecipeCollectionArrayDto = t.array(RecipeCollectionDto);

export const RecipeCollectionIdDto = t.type({
  id: t.string,
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export type CollectionRecipeDto = t.TypeOf<typeof CollectionRecipeDto>;
export type RecipeCollectionDto = t.TypeOf<typeof RecipeCollectionDto>;
export type RecipeCollectionArrayDto = t.TypeOf<
  typeof RecipeCollectionArrayDto
>;

export type RecipeCollectionIdDto = t.TypeOf<typeof RecipeCollectionIdDto>;
