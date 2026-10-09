import { provideRouter } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import { Collection, CollectionId } from '@overckd/domain';
import { CollectionMainMenuGroupComponent } from './collection-main-menu-group.component';

describe('CollectionMainMenuGroupComponent', () => {
  let spectator: Spectator<CollectionMainMenuGroupComponent>;
  const createComponent = createComponentFactory({
    component: CollectionMainMenuGroupComponent,
    providers: [provideRouter([])],
  });

  const collection = (id: string, name: string) =>
    Collection.make({
      id: CollectionId.make(id),
      name,
      description: '',
      recipes: [],
    });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        collections: [
          collection('sweet', 'Sweets'),
          collection('salty', 'Salty'),
        ],
      },
    });
  });

  it('links every collection by its id', () => {
    const links = spectator.queryAll('a');

    expect(links).toHaveText(['Sweets', 'Salty']);
    expect(links.map(link => link.getAttribute('href'))).toEqual([
      '/collections/collection/sweet',
      '/collections/collection/salty',
    ]);
  });
});
