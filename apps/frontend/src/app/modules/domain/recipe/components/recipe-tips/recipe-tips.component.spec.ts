import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RecipeTipsComponent } from './recipe-tips.component';

describe('RecipeTipsComponent', () => {
  let spectator: Spectator<RecipeTipsComponent>;
  const createComponent = createComponentFactory(RecipeTipsComponent);

  const recipe = {
    images: [],
    name: 'mock-name',
    ingredients: [],
    steps: [],
    tips: ['mock-tip-1', 'mock-tip-2'],
    styles: {},
  };

  beforeEach(() => {
    spectator = createComponent({
      props: {
        recipe,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
