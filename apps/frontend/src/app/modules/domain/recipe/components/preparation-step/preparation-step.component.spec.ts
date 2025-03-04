import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RecipePreparationStep } from '@overckd/domain';
import { PreparationStepComponent } from './preparation-step.component';

describe('PreparationStepComponent', () => {
  let spectator: Spectator<PreparationStepComponent>;
  const createComponent = createComponentFactory(PreparationStepComponent);

  const step: RecipePreparationStep = 'mock-step';

  beforeEach(() => {
    spectator = createComponent({
      props: {
        step,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
