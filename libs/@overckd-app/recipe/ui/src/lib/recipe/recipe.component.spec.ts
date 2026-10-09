import { LOCALE_ID } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import {
  BasicRecipePreparation,
  IngredientId,
  NonEmptyHtmlString,
  Portion,
  RecipeId,
  RecipeIngredient,
  RecipePreparation,
  UnitIngredientAmount,
} from '@overckd/domain-experimental';
import { Option } from 'effect';
import { RecipeComponent } from './recipe.component';

const ingredient = (name: string, grams: number) =>
  RecipeIngredient.make({
    uri: IngredientId.make(name.toLowerCase()),
    name,
    amount: Option.some(
      UnitIngredientAmount.make({ unit: 'g', value: grams, scaleFactor: 1 }),
    ),
    optional: false,
    alternatives: [],
  });

const part = (
  id: string,
  name: string,
  first: RecipeIngredient,
): BasicRecipePreparation => ({
  _tag: 'BasicRecipePreparation',
  id: RecipeId.make(id),
  name,
  tips: [],
  basedOn: [],
  ingredients: [first],
  steps: [{ instruction: NonEmptyHtmlString.make(`Use the ${first.name}`) }],
  stepsEnumerated: false,
});

const twoServings: Portion.Portion = {
  kind: 'quantity',
  label: Option.some('servings'),
  quantity: 2,
};

const cake: RecipePreparation = {
  _tag: 'UnionRecipePreparation',
  id: RecipeId.make('cake'),
  name: 'Cake',
  tips: ['Serve <b>cold</b>'],
  recipes: [
    part('cake/dough', 'For the dough', ingredient('Flour', 290)),
    part('cake', 'Cake', ingredient('Sugar', 40)),
  ],
  portion: twoServings,
  images: [
    'http://media.test/images/cake-1.jpeg',
    'http://media.test/images/cake-2.jpeg',
  ],
};

describe('RecipeComponent', () => {
  let spectator: Spectator<RecipeComponent>;
  const createComponent = createComponentFactory({
    component: RecipeComponent,
    providers: [{ provide: LOCALE_ID, useValue: 'en' }],
    detectChanges: false,
  });

  const create = async (recipe: RecipePreparation) => {
    spectator = createComponent({ props: { recipe } });
    await spectator.fixture.whenStable();
  };

  const ingredients = () =>
    spectator
      .queryAll('h6, overckd-ingredient')
      .map(el => el.textContent?.replace(/\s+/g, ' ').trim());

  it('shows the groups first and the own ingredients last', async () => {
    await create(cake);

    expect(spectator.query('h3')).toHaveText('Cake');
    expect(ingredients()).toEqual([
      'For the dough',
      '290 g Flour',
      '40 g Sugar',
    ]);
    expect(spectator.query('overckd-recipe-tips')).toHaveText('Serve cold');
  });

  it('scales the ingredients with the portion', async () => {
    await create(cake);

    spectator.typeInElement('3', 'overckd-portion-converter input');
    await spectator.fixture.whenStable();

    expect(ingredients()).toEqual([
      'For the dough',
      '435 g Flour',
      '60 g Sugar',
    ]);
  });

  it('has no portion to convert for one unlabeled portion', async () => {
    await create({
      ...cake,
      portion: { kind: 'quantity', label: Option.none(), quantity: 1 },
    });

    expect(spectator.query('overckd-portion-converter')).toBeNull();
  });

  it('shows the images by the URLs of the server', async () => {
    await create(cake);

    expect(
      spectator.queryAll('img').map(img => img.getAttribute('src')),
    ).toEqual(
      expect.arrayContaining([
        'http://media.test/images/cake-1.jpeg',
        'http://media.test/images/cake-2.jpeg',
      ]),
    );
  });
});
