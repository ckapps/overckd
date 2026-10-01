import {
  Array as Arr,
  Match,
  Option,
  Predicate,
  Schema,
  SchemaTransformation,
} from 'effect';
import {
  CountIngredientAmount,
  FractionIngredientAmount,
  IngredientAmount,
  LabelIngredientAmount,
  UnitIngredientAmount,
} from './ingredient-amount.model';
import { IngredientId } from './ingredient.model';
import { Portion } from './portion.model';
import {
  RecipeIngredient,
  RecipeIngredientGroup,
} from './recipe-ingredient.model';
import {
  AnyRecipePreparation,
  BasicRecipePreparation,
  PreparationStep,
  RecipePreparation,
} from './recipe-preparation.model';
import { RecipeId } from './recipe.model';
import { NonEmptyHtmlString, Positive } from './shared.model';

// The recipe JSON of the legacy pages (`Recipe` in `libs/domain`), restricted
// to the values `RecipePreparation` can hold. Styles and timers are left out:
// the new model has no place for them. Optional keys may hold `undefined`, as
// in the legacy types: the legacy codecs write `label: undefined` into
// portions without a label, and rxdb keeps it.

const LegacyRecipeIngredient = Schema.Struct({
  uri: Schema.optional(Schema.NonEmptyString),
  name: Schema.NonEmptyString,
  amount: Schema.optional(Schema.Union([Positive, Schema.NonEmptyString])),
  unit: Schema.optional(Schema.String),
  scaleFactor: Schema.optional(Positive),
  optional: Schema.optional(Schema.Boolean),
  alternatives: Schema.optional(Schema.Array(Schema.NonEmptyString)),
});
type LegacyRecipeIngredient = typeof LegacyRecipeIngredient.Type;

const LegacyRecipeIngredientGroup = Schema.Struct({
  group: Schema.NonEmptyString,
  label: Schema.NonEmptyString,
  ingredients: Schema.Array(LegacyRecipeIngredient),
});
type LegacyRecipeIngredientGroup = typeof LegacyRecipeIngredientGroup.Type;

const LegacyPreparationStep = Schema.Union([
  Schema.String,
  Schema.Struct({
    text: Schema.optional(Schema.String),
    html: Schema.optional(Schema.String),
  }),
]);
type LegacyPreparationStep = typeof LegacyPreparationStep.Type;

const LegacyPortion = Schema.Union([
  Schema.Struct({ kind: Schema.Literal('label'), label: Schema.String }),
  Schema.Struct({
    kind: Schema.Literal('quantity'),
    count: Positive,
    label: Schema.optional(Schema.String),
  }),
  Schema.Struct({ kind: Schema.Literal('springform'), diameter: Positive }),
]);
type LegacyPortion = typeof LegacyPortion.Type;

const legacyBaseRecipeFields = {
  name: Schema.NonEmptyString,
  basedOn: Schema.optional(Schema.Array(Schema.NonEmptyString)),
  portion: Schema.optional(LegacyPortion),
  steps: Schema.Array(LegacyPreparationStep),
  tips: Schema.Array(Schema.NonEmptyString),
  stepsEnumerated: Schema.optional(Schema.Boolean),
};

const LegacyRecipeGroup = Schema.Struct({
  ...legacyBaseRecipeFields,
  label: Schema.NonEmptyString,
  ingredients: Schema.Array(LegacyRecipeIngredient),
});
type LegacyRecipeGroup = typeof LegacyRecipeGroup.Type;

const LegacyRecipe = Schema.Struct({
  id: Schema.optional(Schema.NonEmptyString),
  ...legacyBaseRecipeFields,
  ingredients: Schema.Array(
    Schema.Union([LegacyRecipeIngredientGroup, LegacyRecipeIngredient]),
  ),
  images: Schema.Array(Schema.NonEmptyString),
  groups: Schema.optional(Schema.Array(LegacyRecipeGroup)),
  styles: Schema.Struct({}),
});
type LegacyRecipe = typeof LegacyRecipe.Type;

/** The slug of the legacy code: trimmed, lower case, dashes for spaces. */
const slugify = (s: string): string =>
  s.trim().toLowerCase().replace(/\s+/g, '-');

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Characters that text has to escape in HTML. */
const htmlSpecialCharacters = /[&<>]/;

/** Stands in for a list of ingredients that the legacy recipe left empty. */
const noIngredients = RecipeIngredient.make({
  uri: IngredientId.make('overckd://compat/no-ingredients'),
  name: 'No ingredients',
  amount: Option.none(),
  optional: false,
  alternatives: [],
});

/** Stands in for a list of steps that the legacy recipe left empty. */
const noSteps: PreparationStep = {
  instruction: NonEmptyHtmlString.make('No steps'),
};

/** The portion of a legacy recipe without one. */
const defaultPortion: Portion = {
  kind: 'quantity',
  label: Option.none(),
  quantity: 1,
};

const nonEmptyOr = <A>(
  as: ReadonlyArray<A>,
  fallback: A,
): Arr.NonEmptyReadonlyArray<A> =>
  Arr.isReadonlyArrayNonEmpty(as) ? as : [fallback];

// ----------------------------------------------------------------------------
// Legacy → RecipePreparation
// ----------------------------------------------------------------------------

const quantityPortion = (
  quantity: number,
  label: string | undefined,
): Portion => ({
  kind: 'quantity',
  label: label ? Option.some(label) : Option.none(),
  quantity,
});

const portionFromLegacy: (portion: LegacyPortion) => Portion =
  Match.type<LegacyPortion>().pipe(
    Match.discriminatorsExhaustive('kind')({
      label: ({ label }) => quantityPortion(1, label),
      quantity: ({ count, label }) => quantityPortion(count, label),
      springform: ({ diameter }): Portion => ({ kind: 'springform', diameter }),
    }),
  );

const amountFromLegacy = ({
  amount,
  unit,
  scaleFactor = 1,
}: LegacyRecipeIngredient): Option.Option<IngredientAmount> => {
  if (amount === undefined) {
    return Option.none();
  }
  if (Predicate.isString(amount)) {
    return Option.some(
      LabelIngredientAmount.make({
        label: unit ? `${amount} ${unit}` : amount,
      }),
    );
  }
  if (unit) {
    return Option.some(
      UnitIngredientAmount.make({ unit, value: amount, scaleFactor }),
    );
  }
  return Option.some(
    Number.isInteger(amount) && Number.isInteger(scaleFactor)
      ? CountIngredientAmount.make({ count: amount, scaleFactor })
      : FractionIngredientAmount.make({ value: amount, scaleFactor }),
  );
};

const ingredientFromLegacy = (
  ingredient: LegacyRecipeIngredient,
): RecipeIngredient =>
  RecipeIngredient.make({
    uri: IngredientId.make(ingredient.uri ?? slugify(ingredient.name)),
    name: ingredient.name,
    amount: amountFromLegacy(ingredient),
    optional: ingredient.optional ?? false,
    alternatives: ingredient.alternatives ?? [],
  });

const ingredientOrGroupFromLegacy = (
  item: LegacyRecipeIngredient | LegacyRecipeIngredientGroup,
): RecipeIngredient | RecipeIngredientGroup =>
  Schema.is(LegacyRecipeIngredientGroup)(item)
    ? RecipeIngredientGroup.make({
        name: item.group,
        label: item.label,
        ingredients: nonEmptyOr(
          item.ingredients.map(ingredientFromLegacy),
          noIngredients,
        ),
      })
    : ingredientFromLegacy(item);

const stepFromLegacy = (
  step: LegacyPreparationStep,
): ReadonlyArray<PreparationStep> => {
  const html = Predicate.isString(step)
    ? escapeHtml(step)
    : step.html || escapeHtml(step.text ?? '');
  return html === '' ? [] : [{ instruction: NonEmptyHtmlString.make(html) }];
};

const basicFromLegacy = (
  id: RecipeId,
  name: string,
  tips: ReadonlyArray<string>,
  part: LegacyRecipe | LegacyRecipeGroup,
): BasicRecipePreparation => ({
  _tag: 'BasicRecipePreparation',
  id,
  name,
  tips,
  basedOn: part.basedOn ?? [],
  ingredients: nonEmptyOr(
    part.ingredients.map(ingredientOrGroupFromLegacy),
    noIngredients,
  ),
  steps: nonEmptyOr(part.steps.flatMap(stepFromLegacy), noSteps),
  stepsEnumerated: part.stepsEnumerated ?? false,
});

const fromLegacy = (legacy: LegacyRecipe): RecipePreparation => {
  const id = RecipeId.make(legacy.id ?? legacy.name);
  const recipeFields = {
    portion:
      legacy.portion === undefined
        ? defaultPortion
        : portionFromLegacy(legacy.portion),
    images: legacy.images,
  };
  const groups = legacy.groups ?? [];

  if (!Arr.isReadonlyArrayNonEmpty(groups)) {
    return {
      ...basicFromLegacy(id, legacy.name, legacy.tips, legacy),
      ...recipeFields,
    };
  }

  // The legacy page shows the groups first and the recipe's own ingredients
  // and steps last. The own part keeps the id of the recipe; a group's id is
  // the recipe's id and the group's name.
  const groupParts = Arr.map(groups, group =>
    basicFromLegacy(
      RecipeId.make(`${id}/${group.name}`),
      group.label,
      group.tips,
      group,
    ),
  );
  const ownPart =
    legacy.ingredients.length > 0 || legacy.steps.length > 0
      ? [basicFromLegacy(id, legacy.name, [], legacy)]
      : [];

  return {
    _tag: 'UnionRecipePreparation',
    id,
    name: legacy.name,
    tips: legacy.tips,
    recipes: Arr.appendAll(groupParts, ownPart),
    ...recipeFields,
  };
};

// ----------------------------------------------------------------------------
// RecipePreparation → Legacy
// ----------------------------------------------------------------------------

const portionToLegacy: (portion: Portion) => Option.Option<LegacyPortion> =
  Match.type<Portion>().pipe(
    Match.discriminatorsExhaustive('kind')({
      // Recipes without a portion decode to the default portion.
      quantity: ({ quantity, label }) =>
        quantity === 1 && Option.isNone(label)
          ? Option.none()
          : Option.some<LegacyPortion>({
              kind: 'quantity',
              count: quantity,
              ...Option.match(label, {
                onNone: () => ({}),
                onSome: label => ({ label }),
              }),
            }),
      springform: ({ diameter }) =>
        Option.some<LegacyPortion>({ kind: 'springform', diameter }),
    }),
  );

const scaleFactorToLegacy = (scaleFactor: number) =>
  scaleFactor === 1 ? {} : { scaleFactor };

const amountToLegacy: (
  amount: IngredientAmount,
) => Pick<LegacyRecipeIngredient, 'amount' | 'unit' | 'scaleFactor'> =
  Match.type<IngredientAmount>().pipe(
    Match.tagsExhaustive({
      CountIngredientAmount: ({ count, scaleFactor }) => ({
        amount: count,
        ...scaleFactorToLegacy(scaleFactor),
      }),
      FractionIngredientAmount: ({ value, scaleFactor }) => ({
        amount: value,
        ...scaleFactorToLegacy(scaleFactor),
      }),
      UnitIngredientAmount: ({ unit, value, scaleFactor }) => ({
        amount: value,
        unit,
        ...scaleFactorToLegacy(scaleFactor),
      }),
      LabelIngredientAmount: ({ label }) => ({ amount: label }),
    }),
  );

const ingredientToLegacy = (
  ingredient: RecipeIngredient,
): LegacyRecipeIngredient => ({
  // Decoding derives the slug of the name for ingredients without a uri.
  ...(ingredient.uri === slugify(ingredient.name)
    ? {}
    : { uri: ingredient.uri }),
  name: ingredient.name,
  ...Option.match(ingredient.amount, {
    onNone: () => ({}),
    onSome: amountToLegacy,
  }),
  ...(ingredient.optional ? { optional: true } : {}),
  ...(Arr.isReadonlyArrayNonEmpty(ingredient.alternatives)
    ? { alternatives: ingredient.alternatives }
    : {}),
});

const ingredientsToLegacy = (
  ingredients: ReadonlyArray<RecipeIngredient>,
): ReadonlyArray<LegacyRecipeIngredient> =>
  ingredients
    .filter(ingredient => ingredient.uri !== noIngredients.uri)
    .map(ingredientToLegacy);

const ingredientsOrGroupsToLegacy = (
  items: ReadonlyArray<RecipeIngredient | RecipeIngredientGroup>,
): ReadonlyArray<LegacyRecipeIngredient | LegacyRecipeIngredientGroup> =>
  items.flatMap<LegacyRecipeIngredient | LegacyRecipeIngredientGroup>(item =>
    Schema.is(RecipeIngredientGroup)(item)
      ? [
          {
            group: item.name,
            label: item.label,
            ingredients: ingredientsToLegacy(item.ingredients),
          },
        ]
      : ingredientsToLegacy([item]),
  );

/** Legacy groups hold no ingredient groups, so their ingredients are joined. */
const flattenIngredients = (
  items: ReadonlyArray<RecipeIngredient | RecipeIngredientGroup>,
): ReadonlyArray<RecipeIngredient> =>
  items.flatMap(item =>
    Schema.is(RecipeIngredientGroup)(item) ? item.ingredients : [item],
  );

const stepToLegacy = ({
  instruction,
}: PreparationStep): LegacyPreparationStep =>
  htmlSpecialCharacters.test(instruction) ? { html: instruction } : instruction;

const partToLegacy = (part: BasicRecipePreparation) => ({
  ...(Arr.isReadonlyArrayNonEmpty(part.basedOn)
    ? { basedOn: part.basedOn }
    : {}),
  steps: part.steps
    .filter(step => step.instruction !== noSteps.instruction)
    .map(stepToLegacy),
  ...(part.stepsEnumerated ? { stepsEnumerated: true } : {}),
});

const groupToLegacy = (
  recipeId: RecipeId,
  part: BasicRecipePreparation,
): LegacyRecipeGroup => ({
  name: part.id.startsWith(`${recipeId}/`)
    ? part.id.slice(recipeId.length + 1)
    : part.id,
  label: part.name,
  ...partToLegacy(part),
  ingredients: ingredientsToLegacy(flattenIngredients(part.ingredients)),
  tips: part.tips,
});

/** Legacy recipes don't nest, so nested unions are flattened. */
const partsOf = (
  preparation: AnyRecipePreparation,
): ReadonlyArray<BasicRecipePreparation> =>
  preparation._tag === 'BasicRecipePreparation'
    ? [preparation]
    : preparation.recipes.flatMap(partsOf);

const toLegacy = (recipe: RecipePreparation): LegacyRecipe => {
  const parts = partsOf(recipe);
  const ownPart = parts.find(part => part.id === recipe.id);
  const groups = parts
    .filter(part => part !== ownPart)
    .map(part => groupToLegacy(recipe.id, part));
  const portion = portionToLegacy(recipe.portion);

  return {
    id: recipe.id,
    name: recipe.name,
    ...(Option.isSome(portion) ? { portion: portion.value } : {}),
    ...(ownPart === undefined ? { steps: [] } : partToLegacy(ownPart)),
    ingredients:
      ownPart === undefined
        ? []
        : ingredientsOrGroupsToLegacy(ownPart.ingredients),
    tips:
      ownPart === undefined || ownPart === recipe
        ? recipe.tips
        : [...recipe.tips, ...ownPart.tips],
    images: recipe.images,
    ...(Arr.isReadonlyArrayNonEmpty(groups) ? { groups } : {}),
    styles: {},
  };
};

/**
 * `RecipePreparation` in the JSON of the legacy recipe page, which is also the
 * shape of a recipe in the recipe files.
 *
 * Decoding takes a recipe's name as its id when the JSON has none, derives the
 * uri of an ingredient from its name, gives recipes without a portion the
 * portion 1, and turns legacy groups into a `UnionRecipePreparation`. Encoding
 * reverses this, but drops what `RecipePreparation` doesn't hold: styles and
 * timers.
 *
 * @category Schemas
 */
export const RecipePreparationLegacyJson = LegacyRecipe.pipe(
  Schema.decodeTo(
    Schema.toType(RecipePreparation),
    SchemaTransformation.transform({ decode: fromLegacy, encode: toLegacy }),
  ),
);
