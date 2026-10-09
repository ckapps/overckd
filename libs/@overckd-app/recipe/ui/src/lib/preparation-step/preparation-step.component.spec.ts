import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import { NonEmptyHtmlString } from '@overckd/domain';
import { PreparationStepComponent } from './preparation-step.component';

describe('PreparationStepComponent', () => {
  let spectator: Spectator<PreparationStepComponent>;
  const createComponent = createComponentFactory(PreparationStepComponent);

  const step = { instruction: NonEmptyHtmlString.make('Mix <b>well</b>') };

  it('shows the instruction as HTML', () => {
    spectator = createComponent({ props: { step } });

    expect(spectator.query('div b')).toHaveText('well');
    expect(spectator.query('li')).toBeNull();
  });

  it('is a list item when the steps are enumerated', () => {
    spectator = createComponent({ props: { step, stepsEnumerated: true } });

    expect(spectator.query('li')).toHaveText('Mix well');
  });
});
