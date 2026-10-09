import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import { EmptyRecipePageComponent } from './empty-recipe-page.component';

describe('EmptyRecipePageComponent', () => {
  let spectator: Spectator<EmptyRecipePageComponent>;
  const createComponent = createComponentFactory(EmptyRecipePageComponent);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('leaves room to write a recipe by hand', () => {
    expect(spectator.query('h3')).toHaveClass('border-bottom');
    expect(spectator.queryAll('overckd-ingredient')).toHaveLength(15);
    expect(spectator.queryAll('overckd-improvement-notes hr')).toHaveLength(7);
    expect(spectator.query('overckd-portion-converter')).toBeNull();
  });
});
