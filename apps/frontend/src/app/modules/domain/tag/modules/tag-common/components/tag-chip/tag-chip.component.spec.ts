import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TagChipComponent } from './tag-chip.component';

describe('TagChipComponent', () => {
  let spectator: Spectator<TagChipComponent>;
  const createComponent = createComponentFactory(TagChipComponent);

  const tag = {
    uri: 'mock-id',
    label: 'mock-name',
  };

  beforeEach(() => {
    spectator = createComponent({
      props: {
        tag,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
