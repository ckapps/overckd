import { resource, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import {
  Collection,
  CollectionFindByIdPayload,
  CollectionId,
  CollectionNotFound,
  RecipeId,
  RecipeRef,
} from '@overckd/domain';
import { CollectionPageComponent } from './collection-page.component';

const pancakes = RecipeRef.make({
  id: RecipeId.make('Pancakes'),
  name: 'Pancakes',
});

const desserts = Collection.make({
  id: CollectionId.make('desserts'),
  name: 'Desserts',
  description: '',
  recipes: [pancakes],
});

/** `findById` of the collection queries, with only `desserts` */
const findById = (payload: Signal<CollectionFindByIdPayload | undefined>) =>
  resource({
    params: payload,
    loader: ({ params: { id } }) =>
      id === desserts.id
        ? Promise.resolve(desserts)
        : Promise.reject(
            id === 'broken'
              ? new Error('offline')
              : new CollectionNotFound({ id }),
          ),
  });

// A feature lib reaches the ports only through data access, so the specs
// replace the binding instead of the port.
vi.mock('@overckd-app/collection/data-access', () => ({
  injectCollectionQueries: () => ({ findById }),
}));

describe('CollectionPageComponent', () => {
  let spectator: Spectator<CollectionPageComponent>;
  const createComponent = createComponentFactory({
    component: CollectionPageComponent,
    providers: [{ provide: Router, useValue: { navigate: vi.fn() } }],
    detectChanges: false,
  });

  const show = async (id: string) => {
    spectator = createComponent();
    spectator.setInput('id', id);
    await spectator.fixture.whenStable();
  };

  it('shows the recipes of the collection', async () => {
    await show('desserts');

    expect(spectator.query('h2')).toHaveText('Desserts');
    expect(spectator.query('mat-list-item')).toHaveText('Pancakes');
  });

  it('opens a recipe by its id', async () => {
    await show('desserts');

    spectator.click('mat-list-item');

    expect(spectator.inject(Router).navigate).toHaveBeenCalledWith([
      '/recipes',
      'recipe',
      'Pancakes',
    ]);
  });

  it('tells when the collection does not exist', async () => {
    await show('nope');

    expect(spectator.element).toHaveText('This collection does not exist.');
  });

  it('tells when the collection could not be loaded', async () => {
    await show('broken');

    expect(spectator.element).toHaveText('Could not load this collection.');
  });
});
