import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ImprovementNotesComponent } from './improvement-notes.component';

describe('ImprovementNotesComponent', () => {
  let spectator: Spectator<ImprovementNotesComponent>;
  const createComponent = createComponentFactory(ImprovementNotesComponent);

  beforeEach(
    () =>
      (spectator = createComponent({
        props: {
          numberOfLines: 5,
        },
      })),
  );

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
