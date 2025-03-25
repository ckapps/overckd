import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CollectionMainMenuGroupComponent } from './collection-main-menu-group.component';

describe('CollectionsMainMenuGroupComponent', () => {
  let spectator: Spectator<CollectionMainMenuGroupComponent>;
  const createComponent = createComponentFactory(
    CollectionMainMenuGroupComponent,
  );

  beforeEach(() => {
    spectator = createComponent({
      props: {
        collections: [],
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
