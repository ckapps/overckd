import { Option, Schema, Struct } from 'effect';
import { describe, expect, it } from 'vitest';
import { RecipePreparationLegacyJson } from './recipe-preparation.compat';
import {
  BasicRecipePreparation,
  UnionRecipePreparation,
} from './recipe-preparation.model';

type LegacyRecipeJson = Schema.Codec.Encoded<
  typeof RecipePreparationLegacyJson
>;

const loremIpsum =
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';

// The recipes of the in-memory repository of `apps/server-cli`.

const serverCliRecipe1 = {
  name: 'recipe 1',
  images: [],
  ingredients: [],
  steps: [
    'step 1',
    'step 2',
    { html: 'Loorem Ipsum dolor', styles: ['text-center'] },
  ],
  styles: {},
  tips: [],
};

const serverCliRecipe2 = {
  name: 'recipe 2',
  portion: { kind: 'quantity', count: 2 },
  images: [],
  ingredients: [
    { amount: 3, unit: 'kg', name: 'Ingredient 1', alternatives: ['test'] },
    { amount: 10, unit: 'ml', name: 'Ingredient 2', optional: true },
    {
      amount: 5,
      unit: 'TL',
      scaleFactor: 1 / 4,
      name: 'Ingredient with an scale factor of 0.25',
    },
    { amount: '1 Prise', name: 'Ingredient with textual amount' },
  ],
  steps: ['step 1', 'step 2', 'Loorem Ipsum dolor'],
  styles: {},
  tips: [],
};

// The recipes of the files in `data/example-1/app/recipes`, as the legacy
// codec decodes them.

const dataRecipe1 = {
  name: 'Recipe 1',
  ingredients: [
    {
      group: 'Filling',
      label: 'For the filling',
      ingredients: [
        {
          amount: 150,
          unit: 'g',
          name: 'Blueberry jam',
        },
      ],
    },
    {
      group: 'Sprinkle',
      label: 'To Sprinkle',
      ingredients: [
        {
          amount: 80,
          unit: 'g',
          name: 'powdered sugar',
        },
        {
          amount: '1-2',
          unit: 'TL',
          name: 'Lemon juice',
        },
      ],
    },
  ],
  steps: [
    'Lorem ipsum',
    {
      text: 'dolor sit amet, consetetur sadipscing elitr',
      timers: {
        start: ['timer_1'],
      },
    },
    'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat',
    {
      text: 'sed diam voluptua',
      timers: {
        await: ['timer_1'],
        start: ['timer_2'],
      },
    },
    {
      text: 'At vero eos et accusam et justo duo dolores et ea rebum',
      timers: {
        await: ['timer_2'],
      },
    },
    'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet',
  ],
  groups: [
    {
      label: 'For the dough',
      name: 'Basic-Dough',
      basedOn: ['https://duckduckgo.com'],
      ingredients: [
        {
          amount: 150,
          unit: 'ml',
          name: 'soy milk',
        },
        {
          amount: 21,
          unit: 'g',
          name: 'Yeast (fresh)',
        },
        {
          amount: 290,
          unit: 'g',
          name: 'Flour',
        },
        {
          uri: 'overckd://common/ingredients/sugar',
          name: 'Sugar',
          amount: 40,
          unit: 'g',
        },
        {
          amount: 70,
          unit: 'g',
          name: 'vegan butter',
        },
        {
          amount: 0.5,
          unit: 'TL',
          name: 'Salt',
        },
      ],
      steps: [
        'Lorem ipsum',
        'dolor sit amet, consetetur sadipscing elitr',
        'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat',
        'sed diam voluptua',
        'At vero eos et accusam et justo duo dolores et ea rebum',
        'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet',
      ],
      stepsEnumerated: true,
      tips: [],
    },
  ],
  tips: [],
  timers: {
    timer_1: {
      duration: 100,
      units: 's',
    },
    timer_2: {
      duration: 500,
    },
  },
  images: ['/images/recipe-1-1.jpeg'],
  styles: {
    imagesContainer: 'justify-content-end',
    secondaryImagesContainer: 'flex-column justify-content-between col-5 px-0',
  },
};

const dataRecipe2 = {
  name: 'Some other sweet sweet recipe',
  ingredients: [
    {
      group: 'Dough',
      label: 'Springform with 24 or 26cm diameter',
      ingredients: [
        {
          amount: 240,
          unit: 'g',
          name: 'Flour',
        },
        {
          amount: 60,
          unit: 'ml',
          name: 'Oil',
        },
        {
          amount: 2,
          unit: 'TL',
          name: 'Baking soda',
        },
        {
          amount: 80,
          unit: 'g',
          name: 'Sugar',
        },
      ],
    },
  ],
  steps: [
    loremIpsum,
    {
      html: '<hr />',
    },
    loremIpsum,
    {
      text: 'My very fancy button',
      styles: ['btn', 'btn-primary'],
    },
    `${loremIpsum} 😉`,
    {
      text: 'My very fancy text',
    },
  ],
  tips: [],
  images: [],
  styles: {},
};

const dataRecipe3 = {
  name: 'Some delicous salty recipe',
  stepsEnumerated: true,
  portion: {
    kind: 'quantity',
    count: 2,
  },
  ingredients: [
    {
      name: 'vegan pulled pork',
    },
    {
      amount: 2,
      name: 'Pita',
    },
    {
      amount: 4,
      name: 'Tomatoes',
    },
    {
      amount: 0.5,
      name: 'Onions',
    },
    {
      name: 'Rucola',
    },
    {
      amount: 0.25,
      name: 'Cucumber',
    },
    {
      name: 'Chilliflocks',
    },
  ],
  steps: [
    'Put the vegan pulled pork in a pan',
    'Cut bread',
    'Cut the veggies',
    'Put everything in the bread',
    'Give it some chilliflocks',
  ],
  tips: ['Try it with zucchinis!', 'You may also try Thymian or Oregano'],
  images: ['/images/recipe-3-1.jpeg', '/images/recipe-3-1.jpeg'],
  styles: {
    imagesContainer: 'col-12 px-0 ',
    secondaryImagesContainer: 'col-12 order-12   px-0',
    images: ['w-50', 'w-50 ml-auto'],
  },
};

// What the legacy page gets back: styles and timers are gone, text steps are
// plain strings, and a text amount includes its unit.

const expectedServerCliRecipe1: LegacyRecipeJson = {
  ...serverCliRecipe1,
  id: 'recipe 1',
  steps: ['step 1', 'step 2', 'Loorem Ipsum dolor'],
};

const expectedServerCliRecipe2: LegacyRecipeJson = {
  ...serverCliRecipe2,
  id: 'recipe 2',
  portion: { kind: 'quantity', count: 2 },
};

const expectedDataRecipe1: LegacyRecipeJson = {
  ...Struct.omit(dataRecipe1, ['timers']),
  id: 'Recipe 1',
  ingredients: [
    dataRecipe1.ingredients[0],
    {
      group: 'Sprinkle',
      label: 'To Sprinkle',
      ingredients: [
        { amount: 80, unit: 'g', name: 'powdered sugar' },
        { amount: '1-2 TL', name: 'Lemon juice' },
      ],
    },
  ],
  steps: [
    'Lorem ipsum',
    'dolor sit amet, consetetur sadipscing elitr',
    'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat',
    'sed diam voluptua',
    'At vero eos et accusam et justo duo dolores et ea rebum',
    'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet',
  ],
  styles: {},
};

const expectedDataRecipe2: LegacyRecipeJson = {
  ...dataRecipe2,
  id: 'Some other sweet sweet recipe',
  steps: [
    loremIpsum,
    { html: '<hr />' },
    loremIpsum,
    'My very fancy button',
    `${loremIpsum} 😉`,
    'My very fancy text',
  ],
};

const expectedDataRecipe3: LegacyRecipeJson = {
  ...dataRecipe3,
  id: 'Some delicous salty recipe',
  portion: { kind: 'quantity', count: 2 },
  styles: {},
};

describe('RecipePreparationLegacyJson', () => {
  const decode = Schema.decodeUnknownSync(RecipePreparationLegacyJson);
  const encode = Schema.encodeSync(RecipePreparationLegacyJson);

  describe.each([
    ['recipe 1', serverCliRecipe1, expectedServerCliRecipe1],
    ['recipe 2', serverCliRecipe2, expectedServerCliRecipe2],
    ['Recipe 1', dataRecipe1, expectedDataRecipe1],
    ['Some other sweet sweet recipe', dataRecipe2, expectedDataRecipe2],
    ['Some delicous salty recipe', dataRecipe3, expectedDataRecipe3],
  ])('the legacy recipe %s', (_, legacy, expected) => {
    it('should encode back to what the legacy page shows', () => {
      expect(encode(decode(legacy))).toStrictEqual(expected);
    });
    it('should decode what it encodes to the same recipe', () => {
      expect(decode(encode(decode(legacy)))).toEqual(decode(legacy));
    });
  });

  it('should take the name as id', () => {
    expect(decode(dataRecipe3).id).toBe('Some delicous salty recipe');
  });

  it('should turn groups into a union, with the own ingredients and steps last', () => {
    const recipe = decode(dataRecipe1) as UnionRecipePreparation;

    expect(recipe._tag).toBe('UnionRecipePreparation');
    expect(recipe.recipes.map(({ id, name }) => ({ id, name }))).toEqual([
      { id: 'Recipe 1/Basic-Dough', name: 'For the dough' },
      { id: 'Recipe 1', name: 'Recipe 1' },
    ]);
  });

  it('should keep ingredient groups', () => {
    const recipe = decode(dataRecipe2) as BasicRecipePreparation;

    expect(recipe.ingredients[0]).toMatchObject({
      _tag: 'RecipeIngredientGroup',
      name: 'Dough',
      label: 'Springform with 24 or 26cm diameter',
    });
  });

  it('should map the amounts', () => {
    const amounts = (recipe: BasicRecipePreparation) =>
      recipe.ingredients.map(ingredient =>
        'amount' in ingredient ? ingredient.amount : Option.none(),
      );

    expect(amounts(decode(serverCliRecipe2) as BasicRecipePreparation)).toEqual(
      [
        Option.some({
          _tag: 'UnitIngredientAmount',
          unit: 'kg',
          value: 3,
          scaleFactor: 1,
        }),
        Option.some({
          _tag: 'UnitIngredientAmount',
          unit: 'ml',
          value: 10,
          scaleFactor: 1,
        }),
        Option.some({
          _tag: 'UnitIngredientAmount',
          unit: 'TL',
          value: 5,
          scaleFactor: 0.25,
        }),
        Option.some({ _tag: 'LabelIngredientAmount', label: '1 Prise' }),
      ],
    );
    expect(amounts(decode(dataRecipe3) as BasicRecipePreparation)).toEqual([
      Option.none(),
      Option.some({ _tag: 'CountIngredientAmount', count: 2, scaleFactor: 1 }),
      Option.some({ _tag: 'CountIngredientAmount', count: 4, scaleFactor: 1 }),
      Option.some({
        _tag: 'FractionIngredientAmount',
        value: 0.5,
        scaleFactor: 1,
      }),
      Option.none(),
      Option.some({
        _tag: 'FractionIngredientAmount',
        value: 0.25,
        scaleFactor: 1,
      }),
      Option.none(),
    ]);
  });

  it('should derive the uri of an ingredient from its name', () => {
    const recipe = decode(dataRecipe1) as UnionRecipePreparation;
    const dough = recipe.recipes[0] as BasicRecipePreparation;

    expect(dough.ingredients[1]).toMatchObject({
      name: 'Yeast (fresh)',
      uri: 'yeast-(fresh)',
    });
    expect(dough.ingredients[3]).toMatchObject({
      name: 'Sugar',
      uri: 'overckd://common/ingredients/sugar',
    });
  });

  it('should give a recipe without portion the portion 1', () => {
    expect(decode(dataRecipe2).portion).toEqual({
      kind: 'quantity',
      label: Option.none(),
      quantity: 1,
    });
  });

  it('should turn a label portion into a quantity of 1', () => {
    const recipe = decode({
      ...dataRecipe3,
      portion: { kind: 'label', label: 'one cake' },
    });

    expect(recipe.portion).toEqual({
      kind: 'quantity',
      label: Option.some('one cake'),
      quantity: 1,
    });
    expect(encode(recipe).portion).toEqual({
      kind: 'quantity',
      count: 1,
      label: 'one cake',
    });
  });

  it('should read optional keys that hold undefined', () => {
    // The legacy codecs write `label: undefined` into portions without label.
    const legacy = {
      ...dataRecipe3,
      portion: { kind: 'quantity', count: 2, label: undefined },
      ingredients: [{ name: 'Rucola', amount: undefined, uri: undefined }],
    };

    expect(encode(decode(legacy))).toStrictEqual({
      ...expectedDataRecipe3,
      ingredients: [{ name: 'Rucola' }],
    });
  });

  it('should stand in for an empty list of ingredients', () => {
    const recipe = decode(serverCliRecipe1) as BasicRecipePreparation;

    expect(recipe.ingredients).toMatchObject([{ name: 'No ingredients' }]);
  });

  it('should escape text steps as HTML', () => {
    const recipe = decode({
      ...dataRecipe3,
      steps: ['Salt & pepper', { text: '1 < 2' }, { html: '<b>Serve</b>' }],
    });

    expect((recipe as BasicRecipePreparation).steps).toEqual([
      { instruction: 'Salt &amp; pepper' },
      { instruction: '1 &lt; 2' },
      { instruction: '<b>Serve</b>' },
    ]);
    expect(encode(recipe).steps).toEqual([
      { html: 'Salt &amp; pepper' },
      { html: '1 &lt; 2' },
      { html: '<b>Serve</b>' },
    ]);
  });
});
