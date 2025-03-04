import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { EmptyRecipePageComponent } from './empty-recipe.component';

describe('EmptyComponent', () => {
  let spectator: Spectator<EmptyRecipePageComponent>;
  const createComponent = createComponentFactory(EmptyRecipePageComponent);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
