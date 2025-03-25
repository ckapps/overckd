import * as Arr from 'effect/Array';
import * as Schema from 'effect/Schema';
import { Portion, PortionJson } from './portion.model';
import {
  RecipeIngredient,
  RecipeIngredientJson,
} from './recipe-ingredient.model';
import { RecipeId, RecipeIdFromString } from './recipe.model';
import { NonEmptyHtmlString } from './shared.model';

const RecipeSourceLinks = Schema.Array(Schema.NonEmptyString);
const RecipeSourceLinksJson = RecipeSourceLinks;

/**
 * @category Models
 */
export type PreparationStep = Schema.Schema.Type<typeof PreparationStep>;
/**
 * @category Models
 */
export type PreparationStepEncoded = Schema.Schema.Encoded<
  typeof PreparationStep
>;
/**
 * @category Schemas
 */
export const PreparationStep = Schema.Struct({
  /** Textual representation of the step. */
  instruction: NonEmptyHtmlString,
}).annotations({
  identifier: 'PreparationStep',
  title: 'Recipe Preparation Step',
  description: 'A step within a recipe.',
});
export type PreparationStepJson = Schema.Schema.Type<
  typeof PreparationStepJson
>;
/**
 * @category Models
 */
export type PreparationStepJsonEncoded = Schema.Schema.Encoded<
  typeof PreparationStepJson
>;
/**
 * @category Schemas
 */
export const PreparationStepJson = PreparationStep;

const baseFields = {
  /** Recipe identifier. */
  id: RecipeId,
  /** Name of the recipe. */
  name: Schema.NonEmptyString.annotations({
    title: 'Recipe Name',
    description: 'The name of the recipe.',
  }),
};
const baseFieldsJson = {
  /** Recipe identifier. */
  id: RecipeIdFromString,
  /** Name of the recipe. */
  name: baseFields.name,
};

export interface BasicRecipePreparation
  extends Schema.Struct.Type<typeof baseFields> {
  readonly _tag: 'BasicRecipePreparation';
  /** On what the recipe is based on (sources). */
  readonly basedOn: Schema.Schema.Type<typeof RecipeSourceLinks>;
  /** Recipe ingredients. */
  readonly ingredients: Arr.NonEmptyReadonlyArray<RecipeIngredient>;
  /** Steps of preparation. */
  readonly steps: Arr.NonEmptyReadonlyArray<PreparationStep>;
}
interface BasicRecipePreparationEncoded
  extends Schema.Struct.Encoded<typeof baseFields> {
  readonly _tag: 'BasicRecipePreparation';
  readonly basedOn: Schema.Schema.Encoded<typeof RecipeSourceLinks>;
  readonly ingredients: Arr.NonEmptyReadonlyArray<
    typeof RecipeIngredient.Encoded
  >;
  readonly steps: Arr.NonEmptyReadonlyArray<PreparationStepEncoded>;
}
export interface BasicRecipePreparationJson
  extends Schema.Struct.Type<typeof baseFieldsJson> {
  readonly _tag: 'BasicRecipePreparation';
  /** On what the recipe is based on (sources). */
  readonly basedOn: Schema.Schema.Type<typeof RecipeSourceLinksJson>;
  /** Recipe ingredients. */
  readonly ingredients: Arr.NonEmptyReadonlyArray<
    typeof RecipeIngredientJson.Type
  >;
  /** Steps of preparation. */
  readonly steps: Arr.NonEmptyReadonlyArray<PreparationStepJson>;
}
interface BasicRecipePreparationJsonEncoded
  extends Schema.Struct.Encoded<typeof baseFieldsJson> {
  readonly _tag: 'BasicRecipePreparation';
  readonly basedOn: Schema.Schema.Encoded<typeof RecipeSourceLinksJson>;
  readonly ingredients: Arr.NonEmptyReadonlyArray<
    typeof RecipeIngredientJson.Encoded
  >;
  readonly steps: Arr.NonEmptyReadonlyArray<PreparationStepJsonEncoded>;
}
/**
 * @category Schemas
 */
export const BasicRecipePreparation = Schema.TaggedStruct(
  'BasicRecipePreparation',
  {
    ...baseFieldsJson,
    /** On what the recipe is based on (sources). */
    basedOn: RecipeSourceLinks,
    ingredients: Schema.NonEmptyArray(RecipeIngredient),
    steps: Schema.NonEmptyArray(PreparationStep),
  },
).annotations({
  identifier: 'BasicRecipePreparation',
  title: 'Recipe Preparation',
  description: 'A recipe with preparation steps.',
});
/**
 * @category Schemas
 */
export const BasicRecipePreparationJson = Schema.TaggedStruct(
  'BasicRecipePreparation',
  {
    ...baseFields,
    /** On what the recipe is based on (sources). */
    basedOn: RecipeSourceLinksJson,
    ingredients: Schema.NonEmptyArray(RecipeIngredientJson),
    steps: Schema.NonEmptyArray(PreparationStepJson),
  },
)
  .annotations({
    identifier: 'BasicRecipePreparation',
    title: 'Recipe Preparation',
    description: 'A recipe with preparation steps.',
  })
  .pipe(Schema.compose(BasicRecipePreparation));

export interface UnionRecipePreparation
  extends Schema.Struct.Type<typeof baseFields> {
  readonly _tag: 'UnionRecipePreparation';
  readonly recipes: Arr.NonEmptyReadonlyArray<AnyRecipePreparation>;
}
interface UnionRecipePreparationEncoded
  extends Schema.Struct.Encoded<typeof baseFields> {
  readonly _tag: 'UnionRecipePreparation';
  readonly recipes: Arr.NonEmptyReadonlyArray<AnyRecipePreparationEncoded>;
}
export interface UnionRecipePreparationJson
  extends Schema.Struct.Type<typeof baseFields> {
  readonly _tag: 'UnionRecipePreparation';
  readonly recipes: Arr.NonEmptyReadonlyArray<AnyRecipePreparationJson>;
}
interface UnionRecipePreparationJsonEncoded
  extends Schema.Struct.Encoded<typeof baseFields> {
  readonly _tag: 'UnionRecipePreparation';
  readonly recipes: Arr.NonEmptyReadonlyArray<AnyRecipePreparationJsonEncoded>;
}
/**
 * @category Schemas
 */
export const UnionRecipePreparation = Schema.TaggedStruct(
  'UnionRecipePreparation',
  {
    ...baseFields,
    recipes: Schema.NonEmptyArray(
      Schema.suspend(
        (): Schema.Schema<AnyRecipePreparation, AnyRecipePreparationEncoded> =>
          AnyRecipePreparation,
      ),
    ),
  },
).annotations({
  identifier: 'UnionRecipePreparation',
  title: 'Union Recipe Preparation',
  description: 'A recipe that is a union of multiple recipes.',
});
/**
 * @category Schemas
 */
export const UnionRecipePreparationJson = Schema.TaggedStruct(
  'UnionRecipePreparation',
  {
    ...baseFieldsJson,
    recipes: Schema.NonEmptyArray(
      Schema.suspend(
        (): Schema.Schema<
          AnyRecipePreparationJson,
          AnyRecipePreparationJsonEncoded
        > => AnyRecipePreparationJson,
      ),
    ),
  },
)
  .annotations({
    identifier: 'UnionRecipePreparation',
    title: 'Union Recipe Preparation',
    description: 'A recipe that is a union of multiple recipes.',
  })
  .pipe(Schema.compose(UnionRecipePreparation));

const recipePreparationFields = {
  portion: Portion,
};
const recipePreparationFieldsJson = {
  portion: PortionJson,
};
/**
 * @category Models
 */
export type AnyRecipePreparation =
  | BasicRecipePreparation
  | UnionRecipePreparation;

export type AnyRecipePreparationEncoded =
  | BasicRecipePreparationEncoded
  | UnionRecipePreparationEncoded;
/**
 * @category Schemas
 */
export const AnyRecipePreparation = Schema.Union(
  BasicRecipePreparation,
  UnionRecipePreparation,
).annotations({
  identifier: 'AnyRecipePreparation',
});
export const AnyRecipePreparationJson = Schema.Union(
  BasicRecipePreparationJson,
  UnionRecipePreparationJson,
).annotations({
  identifier: 'AnyRecipePreparation',
});
export type AnyRecipePreparationJson =
  | BasicRecipePreparationJson
  | UnionRecipePreparationJson;
type AnyRecipePreparationJsonEncoded =
  | BasicRecipePreparationJsonEncoded
  | UnionRecipePreparationJsonEncoded;

/**
 * @category Models
 */
export type RecipePreparation = (
  | BasicRecipePreparation
  | UnionRecipePreparation
) &
  Schema.Struct.Type<typeof recipePreparationFields>;

export type RecipePreparationEncoded = (
  | BasicRecipePreparationEncoded
  | UnionRecipePreparationEncoded
) &
  Schema.Struct.Encoded<typeof recipePreparationFields>;

/**
 * @category Schemas
 */
export const RecipePreparation = Schema.extend(
  Schema.Struct(recipePreparationFields),
  AnyRecipePreparation,
).annotations({
  identifier: 'RecipePreparation',
  title: 'Recipe Preparation',
  description: 'How to prepare a recipe.',
});

/**
 * @category Schemas
 */
export const RecipePreparationJson = Schema.extend(
  Schema.Struct(recipePreparationFieldsJson),
  AnyRecipePreparationJson,
).pipe(Schema.compose(RecipePreparation));
