import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import { ImprovementNotesComponent } from './improvement-notes.component';

describe('ImprovementNotesComponent', () => {
  let spectator: Spectator<ImprovementNotesComponent>;
  const createComponent = createComponentFactory(ImprovementNotesComponent);

  it('draws the given number of lines', () => {
    spectator = createComponent({ props: { numberOfLines: 5 } });

    expect(spectator.queryAll('hr')).toHaveLength(5);
  });
});
