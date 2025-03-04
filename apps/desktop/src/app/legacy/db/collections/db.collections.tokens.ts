import { createContextToken } from '@marblejs/core';
import { Ingredient, Recipe, RecipeCollection, Tag } from '@overckd/domain';
import { RxCollection } from 'rxdb';

const prefix = 'DB.collections';
// ----------------------------------------------------------------------------
// Tokens
// ----------------------------------------------------------------------------
/**
 * DI token for recipe DB collection
 */
export const IngredientDbCollectionToken = createContextToken<
  RxCollection<Ingredient>
>(`${prefix}.ingredient`);

/**
 * DI token for recipe DB collection
 */
export const RecipeDbCollectionToken = createContextToken<RxCollection<Recipe>>(
  `${prefix}.recipe`,
);

/**
 * DI token for recipe collection DB collection
 */
export const RecipeCollectionDbCollectionToken = createContextToken<
  RxCollection<RecipeCollection>
>(`${prefix}.recipe-collection`);

/**
 * DI token for recipe collection DB collection
 */
export const TagDbCollectionToken = createContextToken<RxCollection<Tag>>(
  `${prefix}.tag`,
);
