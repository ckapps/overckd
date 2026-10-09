import { UnionRecipePreparation } from '@overckd/domain';
import { Option, Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import { RecipeFileYaml } from './recipe-file';

// The files in `data/example-1/app/recipes`.

const recipe1Yaml = `overckd: 1.0.0

recipe:
  name: Recipe 1

  ingredients:
    - group: Filling
      label: For the filling
      ingredients:
        - amount: 150
          unit: g
          name: Blueberry jam
    - group: Sprinkle
      label: To Sprinkle
      ingredients:
        - amount: 80
          unit: g
          name: powdered sugar
        - amount: 1-2
          unit: TL
          name: Lemon juice

  steps:
    - Lorem ipsum
    - text: dolor sit amet, consetetur sadipscing elitr
      timers:
        start: [timer_1]

    - sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat
    - text: sed diam voluptua
      timers:
        await: [timer_1]
        start: [timer_2]
    - text: At vero eos et accusam et justo duo dolores et ea rebum
      timers:
        await:
          - timer_2
    - Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet

  groups:
    - label: 'For the dough'
      name: 'Basic-Dough'
      basedOn:
        - 'https://duckduckgo.com'

      ingredients:
        - amount: 150
          unit: ml
          name: soy milk
        - amount: 21
          unit: g
          name: Yeast (fresh)
        - amount: 290
          unit: g
          name: Flour
        - uri: overckd://common/ingredients/sugar
          name: Sugar
          amount: 40
          unit: g
        - amount: 70
          unit: g
          name: vegan butter
        - amount: 0.5
          unit: TL
          name: Salt

      steps:
        - Lorem ipsum
        - dolor sit amet, consetetur sadipscing elitr
        - sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat
        - sed diam voluptua
        - At vero eos et accusam et justo duo dolores et ea rebum
        - Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet

      stepsEnumerated: true
      tips: []

  tips: []
  timers:
    timer_1:
      duration: 100
      units: s
    timer_2:
      duration: 500

  images:
    - /images/recipe-1-1.jpeg

  styles:
    imagesContainer: justify-content-end
    secondaryImagesContainer: flex-column justify-content-between col-5 px-0
`;

const recipe2Yaml = `overckd: 1.0.0
recipe:
  name: Some other sweet sweet recipe
  ingredients:
    - group: Dough
      label: Springform with 24 or 26cm diameter
      ingredients:
        - amount: 240
          unit: g
          name: Flour
        - amount: 60
          unit: ml
          name: Oil
        - amount: 2
          unit: TL
          name: Baking soda
        - amount: 80
          unit: g
          name: Sugar

  steps:
    - Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
    - html: <hr />
    - Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
    - text: My very fancy button
      styles:
        - btn
        - btn-primary
    - Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 😉
    - text: My very fancy text
  tips: []
  images: []
  styles: {}
`;

const recipe3Yaml = `overckd: 1.0.0
recipe:
  name: Some delicous salty recipe
  stepsEnumerated: true
  portion:
    kind: 'quantity'
    count: 2
  ingredients:
    - name: vegan pulled pork
    - amount: 2
      name: Pita
    - amount: 4
      name: Tomatoes
    - amount: 0.5
      name: Onions
    - name: Rucola
    - amount: 0.25
      name: Cucumber
    - name: Chilliflocks
  steps:
    - Put the vegan pulled pork in a pan
    - Cut bread
    - Cut the veggies
    - Put everything in the bread
    - Give it some chilliflocks
  tips:
    - Try it with zucchinis!
    - You may also try Thymian or Oregano
  images:
    - /images/recipe-3-1.jpeg
    - /images/recipe-3-1.jpeg
  styles:
    imagesContainer: 'col-12 px-0 '
    secondaryImagesContainer: col-12 order-12   px-0
    images:
      - w-50
      - w-50 ml-auto
`;

const pancakes = `overckd: 1.0.0
recipe:
  name: Pancakes
  ingredients:
    - name: Flour
  steps: &steps
    - Mix
    - Bake
  groups:
    - name: Second-Batch
      label: The second batch
      ingredients:
        - name: Flour
      steps: *steps
      tips: []
  tips: []
  images: []
  styles: {}
`;

describe('RecipeFileYaml', () => {
  const decode = Schema.decodeUnknownSync(RecipeFileYaml);

  describe.each([
    [
      'recipe-1.recipe.yaml',
      recipe1Yaml,
      {
        _tag: 'UnionRecipePreparation',
        id: 'Recipe 1',
        name: 'Recipe 1',
        images: ['/images/recipe-1-1.jpeg'],
      },
    ],
    [
      'recipe-2.recipe.yaml',
      recipe2Yaml,
      {
        _tag: 'BasicRecipePreparation',
        id: 'Some other sweet sweet recipe',
        name: 'Some other sweet sweet recipe',
        images: [],
      },
    ],
    [
      'recipe-3.recipe.yaml',
      recipe3Yaml,
      {
        _tag: 'BasicRecipePreparation',
        id: 'Some delicous salty recipe',
        name: 'Some delicous salty recipe',
        portion: { kind: 'quantity', label: Option.none(), quantity: 2 },
        tips: ['Try it with zucchinis!', 'You may also try Thymian or Oregano'],
        images: ['/images/recipe-3-1.jpeg', '/images/recipe-3-1.jpeg'],
      },
    ],
  ])('the file %s in data/', (_, text, expected) => {
    it('should decode to the recipe, with its name as id', () => {
      expect(decode(text)).toMatchObject(expected);
    });
  });

  it('should read the groups of a recipe as parts of a union', () => {
    const recipe = decode(recipe1Yaml) as UnionRecipePreparation;

    expect(recipe.recipes.map(({ id }) => id)).toEqual([
      'Recipe 1/Basic-Dough',
      'Recipe 1',
    ]);
  });

  it('should resolve YAML anchors', () => {
    const recipe = decode(pancakes) as UnionRecipePreparation;
    const steps = [{ instruction: 'Mix' }, { instruction: 'Bake' }];

    expect(recipe.recipes).toMatchObject([{ steps }, { steps }]);
  });

  it('should fail without the overckd header', () => {
    expect(() => decode(pancakes.replace('overckd: 1.0.0\n', ''))).toThrow();
  });

  it('should fail on another version of the format', () => {
    expect(() =>
      decode(pancakes.replace('overckd: 1.0.0', 'overckd: 2.0.0')),
    ).toThrow();
  });

  it('should fail on a recipe without name', () => {
    expect(() => decode(pancakes.replace('  name: Pancakes\n', ''))).toThrow();
  });

  it('should fail on invalid YAML', () => {
    expect(() => decode(`${pancakes}  tips: [`)).toThrow('Invalid YAML');
  });

  it('should not encode yet', () => {
    const recipe = decode(recipe3Yaml);

    expect(() => Schema.encodeSync(RecipeFileYaml)(recipe)).toThrow(
      'Encoding is not supported',
    );
  });
});
