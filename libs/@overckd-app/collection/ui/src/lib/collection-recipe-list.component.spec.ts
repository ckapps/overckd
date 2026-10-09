import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import {
  Collection,
  CollectionId,
  RecipeId,
  RecipeRef,
} from '@overckd/domain-experimental';
import { CollectionRecipeListComponent } from './collection-recipe-list.component';

describe('CollectionRecipeListComponent', () => {
  let spectator: Spectator<CollectionRecipeListComponent>;
  const createComponent = createComponentFactory(CollectionRecipeListComponent);

  const pancakes = RecipeRef.make({
    id: RecipeId.make('Pancakes'),
    name: 'Pancakes',
  });
  const waffles = RecipeRef.make({
    id: RecipeId.make('Waffles'),
    name: 'Waffles',
  });
  const desserts = Collection.make({
    id: CollectionId.make('desserts'),
    name: 'Desserts',
    description: '',
    recipes: [pancakes, waffles],
  });

  beforeEach(() => {
    spectator = createComponent({ props: { collection: desserts } });
  });

  it('shows the name of the collection and of its recipes', () => {
    expect(spectator.query('h2')).toHaveText('Desserts');
    expect(spectator.queryAll('mat-list-item')).toHaveText([
      'Pancakes',
      'Waffles',
    ]);
  });

  it('emits the clicked recipe', () => {
    let selected: RecipeRef | undefined;
    spectator.output('selected').subscribe(recipe => (selected = recipe));

    spectator.click(spectator.queryAll('mat-list-item')[1]);

    expect(selected).toBe(waffles);
  });
});
