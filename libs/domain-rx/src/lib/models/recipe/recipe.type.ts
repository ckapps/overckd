import { t } from '@marblejs/middleware-io';

// ----------------------------------------------------------------------------
// Consts
// ----------------------------------------------------------------------------

export const RecipeDto = t.type({
  name: t.string,
});

export const RecipeNameDto = t.type({
  name: t.string,
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export type RecipeDto = t.TypeOf<typeof RecipeDto>;

export type RecipeNameDto = t.TypeOf<typeof RecipeNameDto>;
