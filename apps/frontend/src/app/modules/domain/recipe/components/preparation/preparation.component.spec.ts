import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PreparationComponent } from './preparation.component';

describe('PreparationComponent', () => {
  let spectator: Spectator<PreparationComponent>;
  const createComponent = createComponentFactory(PreparationComponent);

  const recipe = {
    images: [],
    name: 'mock-name',
    ingredients: [],
    steps: [],
    tips: ['mock-tip-1', 'mock-tip-2'],
    styles: {},
  };

  beforeEach(
    () =>
      (spectator = createComponent({
        props: {
          recipe,
        },
      })),
  );

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
