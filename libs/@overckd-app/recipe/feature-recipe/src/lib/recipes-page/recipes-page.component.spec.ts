import { resource } from '@angular/core';
import { Router } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import { Collection, CollectionId, RecipeId, RecipeRef } from '@overckd/domain';
import { RecipesPageComponent } from './recipes-page.component';

const collection = (id: string, name: string, recipes: Array<string>) =>
  Collection.make({
    id: CollectionId.make(id),
    name,
    description: '',
    recipes: recipes.map(recipe =>
      RecipeRef.make({ id: RecipeId.make(recipe), name: recipe }),
    ),
  });

/** `getAll` of the collection queries */
const getAll = () =>
  resource({
    loader: () =>
      Promise.resolve([
        collection('sweet', 'Sweets', ['Pancakes', 'Waffles']),
        collection('salty', 'Salty', ['Fries']),
      ]),
  });

// A feature lib reaches the ports only through data access, so the specs
// replace the binding instead of the port.
vi.mock('@overckd-app/collection/data-access', () => ({
  injectCollectionQueries: () => ({ getAll }),
}));

describe('RecipesPageComponent', () => {
  let spectator: Spectator<RecipesPageComponent>;
  const createComponent = createComponentFactory({
    component: RecipesPageComponent,
    providers: [{ provide: Router, useValue: { navigate: vi.fn() } }],
  });

  beforeEach(async () => {
    spectator = createComponent();
    await spectator.fixture.whenStable();
  });

  it('lists the recipes of every collection', () => {
    expect(spectator.queryAll('h2')).toHaveText(['Sweets', 'Salty']);
    expect(spectator.queryAll('mat-list-item')).toHaveText([
      'Pancakes',
      'Waffles',
      'Fries',
    ]);
  });

  it('opens a recipe by its id', () => {
    spectator.click(spectator.queryAll('mat-list-item')[2]);

    expect(spectator.inject(Router).navigate).toHaveBeenCalledWith([
      '/recipes',
      'recipe',
      'Fries',
    ]);
  });
});
