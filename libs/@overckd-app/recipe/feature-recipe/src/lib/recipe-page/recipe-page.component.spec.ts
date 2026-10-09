import { resource, Signal } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import {
  IngredientId,
  NonEmptyHtmlString,
  RecipeFindByIdPayload,
  RecipeId,
  RecipeIngredient,
  RecipeNotFound,
  RecipePreparation,
} from '@overckd/domain';
import { Option } from 'effect';
import { RecipePageComponent } from './recipe-page.component';

const pancakes: RecipePreparation = {
  _tag: 'BasicRecipePreparation',
  id: RecipeId.make('Pancakes'),
  name: 'Pancakes',
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
  steps: [{ instruction: NonEmptyHtmlString.make('Mix and fry') }],
  stepsEnumerated: false,
  portion: { kind: 'quantity', label: Option.none(), quantity: 1 },
  images: [],
};

/** `findById` of the recipe queries, with only `pancakes` */
const findById = (payload: Signal<RecipeFindByIdPayload | undefined>) =>
  resource({
    params: payload,
    loader: ({ params: { id } }) =>
      id === pancakes.id
        ? Promise.resolve(pancakes)
        : Promise.reject(
            id === 'broken' ? new Error('offline') : new RecipeNotFound({ id }),
          ),
  });

// A feature lib reaches the ports only through data access, so the specs
// replace the binding instead of the port.
vi.mock('@overckd-app/recipe/data-access', () => ({
  injectRecipeQueries: () => ({ findById }),
}));

describe('RecipePageComponent', () => {
  let spectator: Spectator<RecipePageComponent>;
  const createComponent = createComponentFactory({
    component: RecipePageComponent,
    detectChanges: false,
  });

  const show = async (id: string) => {
    spectator = createComponent();
    spectator.setInput('id', id);
    await spectator.fixture.whenStable();
  };

  it('shows the recipe', async () => {
    await show('Pancakes');

    expect(spectator.query('h3')).toHaveText('Pancakes');
    expect(spectator.query('overckd-preparation')).toHaveText('Mix and fry');
  });

  it('tells when the recipe does not exist', async () => {
    await show('Waffles');

    expect(spectator.element).toHaveText('This recipe does not exist.');
  });

  it('tells when the recipe could not be loaded', async () => {
    await show('broken');

    expect(spectator.element).toHaveText('Could not load this recipe.');
  });
});
