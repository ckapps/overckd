import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import {
  BasicRecipePreparation,
  IngredientId,
  NonEmptyHtmlString,
  RecipeId,
  RecipeIngredient,
  RecipePreparation,
} from '@overckd/domain-experimental';
import { Option } from 'effect';
import { PreparationComponent } from './preparation.component';

const part = (
  id: string,
  name: string,
  steps: [string, ...Array<string>],
  stepsEnumerated: boolean,
): BasicRecipePreparation => ({
  _tag: 'BasicRecipePreparation',
  id: RecipeId.make(id),
  name,
  tips: [],
  basedOn: [],
  ingredients: [
    RecipeIngredient.make({
      uri: IngredientId.make('flour'),
      name: 'Flour',
      amount: Option.none(),
      optional: false,
      alternatives: [],
    }),
  ],
  steps: [
    { instruction: NonEmptyHtmlString.make(steps[0]) },
    ...steps
      .slice(1)
      .map(step => ({ instruction: NonEmptyHtmlString.make(step) })),
  ],
  stepsEnumerated,
});

const portion = {
  kind: 'quantity',
  label: Option.none(),
  quantity: 1,
} as const;

describe('PreparationComponent', () => {
  let spectator: Spectator<PreparationComponent>;
  const createComponent = createComponentFactory(PreparationComponent);

  it('shows the steps of a recipe', () => {
    const recipe: RecipePreparation = {
      ...part('pancakes', 'Pancakes', ['Mix', 'Fry'], false),
      portion,
      images: [],
    };
    spectator = createComponent({ props: { recipe } });

    expect(spectator.query('h5')).toBeNull();
    expect(spectator.queryAll('overckd-preparation-step')).toHaveText([
      'Mix',
      'Fry',
    ]);
  });

  it('numbers the steps of the groups first and the own steps last', () => {
    const recipe: RecipePreparation = {
      _tag: 'UnionRecipePreparation',
      id: RecipeId.make('cake'),
      name: 'Cake',
      tips: [],
      recipes: [
        part('cake/dough', 'For the dough', ['Knead', 'Rest'], true),
        part('cake', 'Cake', ['Bake'], true),
      ],
      portion,
      images: [],
    };
    spectator = createComponent({ props: { recipe } });

    expect(spectator.queryAll('h5')).toHaveText([
      'For the dough',
      'Weitere Zubereitung',
    ]);
    expect(
      spectator.queryAll('ol').map(list => list.getAttribute('start')),
    ).toEqual(['1', '3']);
    expect(spectator.queryAll('li')).toHaveText(['Knead', 'Rest', 'Bake']);
  });
});
