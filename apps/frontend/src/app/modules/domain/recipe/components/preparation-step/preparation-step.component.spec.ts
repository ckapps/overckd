import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PreparationStep } from '@overckd/domain';
import { PreparationStepComponent } from './preparation-step.component';

describe('PreparationStepComponent', () => {
  let spectator: Spectator<PreparationStepComponent>;
  const createComponent = createComponentFactory(PreparationStepComponent);

  const step: PreparationStep.PreparationStep = {
    text: 'mock-step',
    format: 'text',
  };

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
