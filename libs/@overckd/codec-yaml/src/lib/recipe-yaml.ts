import {
  BasicRecipePreparation,
  CountIngredientAmount,
  FractionIngredientAmount,
  IngredientAmount,
  IngredientId,
  LabelIngredientAmount,
  NonEmptyHtmlString,
  Portion,
  PreparationStep,
  RecipeId,
  RecipeIngredient,
  RecipeIngredientGroup,
  RecipePreparation,
  UnionRecipePreparation,
  UnitIngredientAmount,
} from '@overckd/domain';
import {
  Array as Arr,
  Match,
  Option,
  Predicate,
  Schema,
  SchemaTransformation,
} from 'effect';

// The `recipe` of a recipe file, restricted to the values `RecipePreparation`
// can hold. Styles and timers are left out: the model has no place for them.

const Positive = Schema.Number.check(Schema.isGreaterThan(0));

const RecipeIngredientYaml = Schema.Struct({
  uri: Schema.optional(Schema.NonEmptyString),
  name: Schema.NonEmptyString,
  amount: Schema.optional(Schema.Union([Positive, Schema.NonEmptyString])),
  unit: Schema.optional(Schema.String),
  scaleFactor: Schema.optional(Positive),
  optional: Schema.optional(Schema.Boolean),
  alternatives: Schema.optional(Schema.Array(Schema.NonEmptyString)),
});
type RecipeIngredientYaml = typeof RecipeIngredientYaml.Type;

const RecipeIngredientGroupYaml = Schema.Struct({
  group: Schema.NonEmptyString,
  label: Schema.NonEmptyString,
  ingredients: Schema.Array(RecipeIngredientYaml),
});
type RecipeIngredientGroupYaml = typeof RecipeIngredientGroupYaml.Type;

const PreparationStepYaml = Schema.Union([
  Schema.String,
  Schema.Struct({
    text: Schema.optional(Schema.String),
    html: Schema.optional(Schema.String),
  }),
]);
type PreparationStepYaml = typeof PreparationStepYaml.Type;

const PortionYaml = Schema.Union([
  Schema.Struct({ kind: Schema.Literal('label'), label: Schema.String }),
  Schema.Struct({
    kind: Schema.Literal('quantity'),
    count: Positive,
    label: Schema.optional(Schema.String),
  }),
  Schema.Struct({ kind: Schema.Literal('springform'), diameter: Positive }),
]);
type PortionYaml = typeof PortionYaml.Type;

const baseRecipeYamlFields = {
  name: Schema.NonEmptyString,
  basedOn: Schema.optional(Schema.Array(Schema.NonEmptyString)),
  portion: Schema.optional(PortionYaml),
  steps: Schema.Array(PreparationStepYaml),
  tips: Schema.Array(Schema.NonEmptyString),
  stepsEnumerated: Schema.optional(Schema.Boolean),
};

const RecipeGroupYaml = Schema.Struct({
  ...baseRecipeYamlFields,
  label: Schema.NonEmptyString,
  ingredients: Schema.Array(RecipeIngredientYaml),
});
type RecipeGroupYaml = typeof RecipeGroupYaml.Type;

const RecipeYamlStruct = Schema.Struct({
  id: Schema.optional(Schema.NonEmptyString),
  ...baseRecipeYamlFields,
  ingredients: Schema.Array(
    Schema.Union([RecipeIngredientGroupYaml, RecipeIngredientYaml]),
  ),
  images: Schema.Array(Schema.NonEmptyString),
  groups: Schema.optional(Schema.Array(RecipeGroupYaml)),
  styles: Schema.Struct({}),
});
type RecipeYamlStruct = typeof RecipeYamlStruct.Type;

/** A slug: trimmed, lower case, dashes for spaces. */
const slugify = (s: string): string =>
  s.trim().toLowerCase().replace(/\s+/g, '-');

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Characters that text has to escape in HTML. */
const htmlSpecialCharacters = /[&<>]/;

/** Stands in for a list of ingredients that the file left empty. */
const noIngredients = RecipeIngredient.make({
  uri: IngredientId.make('overckd://compat/no-ingredients'),
  name: 'No ingredients',
  amount: Option.none(),
  optional: false,
  alternatives: [],
});

/** Stands in for a list of steps that the file left empty. */
const noSteps: PreparationStep = {
  instruction: NonEmptyHtmlString.make('No steps'),
};

/** The portion of a recipe whose file has none. */
const defaultPortion: Portion.Portion = {
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
// YAML → RecipePreparation
// ----------------------------------------------------------------------------

const quantityPortion = (
  quantity: number,
  label: string | undefined,
): Portion.Portion => ({
  kind: 'quantity',
  label: label ? Option.some(label) : Option.none(),
  quantity,
});

const portionFromYaml: (portion: PortionYaml) => Portion.Portion =
  Match.type<PortionYaml>().pipe(
    Match.discriminatorsExhaustive('kind')({
      label: ({ label }) => quantityPortion(1, label),
      quantity: ({ count, label }) => quantityPortion(count, label),
      springform: ({ diameter }): Portion.Portion => ({
        kind: 'springform',
        diameter,
      }),
    }),
  );

const amountFromYaml = ({
  amount,
  unit,
  scaleFactor = 1,
}: RecipeIngredientYaml): Option.Option<IngredientAmount> => {
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

const ingredientFromYaml = (
  ingredient: RecipeIngredientYaml,
): RecipeIngredient =>
  RecipeIngredient.make({
    uri: IngredientId.make(ingredient.uri ?? slugify(ingredient.name)),
    name: ingredient.name,
    amount: amountFromYaml(ingredient),
    optional: ingredient.optional ?? false,
    alternatives: ingredient.alternatives ?? [],
  });

const ingredientOrGroupFromYaml = (
  item: RecipeIngredientYaml | RecipeIngredientGroupYaml,
): RecipeIngredient | RecipeIngredientGroup =>
  Schema.is(RecipeIngredientGroupYaml)(item)
    ? RecipeIngredientGroup.make({
        name: item.group,
        label: item.label,
        ingredients: nonEmptyOr(
          item.ingredients.map(ingredientFromYaml),
          noIngredients,
        ),
      })
    : ingredientFromYaml(item);

const stepFromYaml = (
  step: PreparationStepYaml,
): ReadonlyArray<PreparationStep> => {
  const html = Predicate.isString(step)
    ? escapeHtml(step)
    : step.html || escapeHtml(step.text ?? '');
  return html === '' ? [] : [{ instruction: NonEmptyHtmlString.make(html) }];
};

const basicFromYaml = (
  id: RecipeId,
  name: string,
  tips: ReadonlyArray<string>,
  part: RecipeYamlStruct | RecipeGroupYaml,
): BasicRecipePreparation => ({
  _tag: 'BasicRecipePreparation',
  id,
  name,
  tips,
  basedOn: part.basedOn ?? [],
  ingredients: nonEmptyOr(
    part.ingredients.map(ingredientOrGroupFromYaml),
    noIngredients,
  ),
  steps: nonEmptyOr(part.steps.flatMap(stepFromYaml), noSteps),
  stepsEnumerated: part.stepsEnumerated ?? false,
});

const fromYaml = (yaml: RecipeYamlStruct): RecipePreparation => {
  const id = RecipeId.make(yaml.id ?? yaml.name);
  const recipeFields = {
    portion:
      yaml.portion === undefined
        ? defaultPortion
        : portionFromYaml(yaml.portion),
    images: yaml.images,
  };
  const groups = yaml.groups ?? [];

  if (!Arr.isReadonlyArrayNonEmpty(groups)) {
    return {
      ...basicFromYaml(id, yaml.name, yaml.tips, yaml),
      ...recipeFields,
    };
  }

  // The groups come first and the recipe's own ingredients and steps last,
  // as the recipe page shows them. The own part keeps the id of the recipe; a group's id is
  // the recipe's id and the group's name.
  const groupParts = Arr.map(groups, group =>
    basicFromYaml(
      RecipeId.make(`${id}/${group.name}`),
      group.label,
      group.tips,
      group,
    ),
  );
  const ownPart =
    yaml.ingredients.length > 0 || yaml.steps.length > 0
      ? [basicFromYaml(id, yaml.name, [], yaml)]
      : [];

  return {
    _tag: 'UnionRecipePreparation',
    id,
    name: yaml.name,
    tips: yaml.tips,
    recipes: Arr.appendAll(groupParts, ownPart),
    ...recipeFields,
  };
};

// ----------------------------------------------------------------------------
// RecipePreparation → YAML
// ----------------------------------------------------------------------------

const portionToYaml: (portion: Portion.Portion) => Option.Option<PortionYaml> =
  Match.type<Portion.Portion>().pipe(
    Match.discriminatorsExhaustive('kind')({
      // Recipes without a portion decode to the default portion.
      quantity: ({ quantity, label }) =>
        quantity === 1 && Option.isNone(label)
          ? Option.none()
          : Option.some<PortionYaml>({
              kind: 'quantity',
              count: quantity,
              ...Option.match(label, {
                onNone: () => ({}),
                onSome: label => ({ label }),
              }),
            }),
      springform: ({ diameter }) =>
        Option.some<PortionYaml>({ kind: 'springform', diameter }),
    }),
  );

const scaleFactorToYaml = (scaleFactor: number) =>
  scaleFactor === 1 ? {} : { scaleFactor };

const amountToYaml: (
  amount: IngredientAmount,
) => Pick<RecipeIngredientYaml, 'amount' | 'unit' | 'scaleFactor'> =
  Match.type<IngredientAmount>().pipe(
    Match.tagsExhaustive({
      CountIngredientAmount: ({ count, scaleFactor }) => ({
        amount: count,
        ...scaleFactorToYaml(scaleFactor),
      }),
      FractionIngredientAmount: ({ value, scaleFactor }) => ({
        amount: value,
        ...scaleFactorToYaml(scaleFactor),
      }),
      UnitIngredientAmount: ({ unit, value, scaleFactor }) => ({
        amount: value,
        unit,
        ...scaleFactorToYaml(scaleFactor),
      }),
      LabelIngredientAmount: ({ label }) => ({ amount: label }),
    }),
  );

const ingredientToYaml = (
  ingredient: RecipeIngredient,
): RecipeIngredientYaml => ({
  // Decoding derives the slug of the name for ingredients without a uri.
  ...(ingredient.uri === slugify(ingredient.name)
    ? {}
    : { uri: ingredient.uri }),
  name: ingredient.name,
  ...Option.match(ingredient.amount, {
    onNone: () => ({}),
    onSome: amountToYaml,
  }),
  ...(ingredient.optional ? { optional: true } : {}),
  ...(Arr.isReadonlyArrayNonEmpty(ingredient.alternatives)
    ? { alternatives: ingredient.alternatives }
    : {}),
});

const ingredientsToYaml = (
  ingredients: ReadonlyArray<RecipeIngredient>,
): ReadonlyArray<RecipeIngredientYaml> =>
  ingredients
    .filter(ingredient => ingredient.uri !== noIngredients.uri)
    .map(ingredientToYaml);

const ingredientsOrGroupsToYaml = (
  items: ReadonlyArray<RecipeIngredient | RecipeIngredientGroup>,
): ReadonlyArray<RecipeIngredientYaml | RecipeIngredientGroupYaml> =>
  items.flatMap<RecipeIngredientYaml | RecipeIngredientGroupYaml>(item =>
    Schema.is(RecipeIngredientGroup)(item)
      ? [
          {
            group: item.name,
            label: item.label,
            ingredients: ingredientsToYaml(item.ingredients),
          },
        ]
      : ingredientsToYaml([item]),
  );

/** A file's groups hold no ingredient groups, so their ingredients are joined. */
const flattenIngredients = (
  items: ReadonlyArray<RecipeIngredient | RecipeIngredientGroup>,
): ReadonlyArray<RecipeIngredient> =>
  items.flatMap(item =>
    Schema.is(RecipeIngredientGroup)(item) ? item.ingredients : [item],
  );

const stepToYaml = ({ instruction }: PreparationStep): PreparationStepYaml =>
  htmlSpecialCharacters.test(instruction) ? { html: instruction } : instruction;

const partToYaml = (part: BasicRecipePreparation) => ({
  ...(Arr.isReadonlyArrayNonEmpty(part.basedOn)
    ? { basedOn: part.basedOn }
    : {}),
  steps: part.steps
    .filter(step => step.instruction !== noSteps.instruction)
    .map(stepToYaml),
  ...(part.stepsEnumerated ? { stepsEnumerated: true } : {}),
});

const groupToYaml = (
  recipeId: RecipeId,
  part: BasicRecipePreparation,
): RecipeGroupYaml => ({
  name: part.id.startsWith(`${recipeId}/`)
    ? part.id.slice(recipeId.length + 1)
    : part.id,
  label: part.name,
  ...partToYaml(part),
  ingredients: ingredientsToYaml(flattenIngredients(part.ingredients)),
  tips: part.tips,
});

/** Recipe files don't nest groups, so nested unions are flattened. */
const partsOf = (
  preparation: BasicRecipePreparation | UnionRecipePreparation,
): ReadonlyArray<BasicRecipePreparation> =>
  preparation._tag === 'BasicRecipePreparation'
    ? [preparation]
    : preparation.recipes.flatMap(partsOf);

const toYaml = (recipe: RecipePreparation): RecipeYamlStruct => {
  const parts = partsOf(recipe);
  const ownPart = parts.find(part => part.id === recipe.id);
  const groups = parts
    .filter(part => part !== ownPart)
    .map(part => groupToYaml(recipe.id, part));
  const portion = portionToYaml(recipe.portion);

  return {
    id: recipe.id,
    name: recipe.name,
    ...(Option.isSome(portion) ? { portion: portion.value } : {}),
    ...(ownPart === undefined ? { steps: [] } : partToYaml(ownPart)),
    ingredients:
      ownPart === undefined
        ? []
        : ingredientsOrGroupsToYaml(ownPart.ingredients),
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
 * The `recipe` of a recipe file → `RecipePreparation`.
 *
 * Decoding takes a recipe's name as its id when the file has none, derives the
 * uri of an ingredient from its name, gives recipes without a portion the
 * portion 1, and turns groups into a `UnionRecipePreparation`. Encoding
 * reverses this, but drops what `RecipePreparation` doesn't hold: styles and
 * timers.
 *
 * @category Schemas
 */
export const RecipeYaml = RecipeYamlStruct.pipe(
  Schema.decodeTo(
    Schema.toType(RecipePreparation),
    SchemaTransformation.transform({ decode: fromYaml, encode: toYaml }),
  ),
);
