import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { OverckdNotFoundPage } from './not-found-page.component';

describe('OverckdNotFoundPage', () => {
  let spectator: Spectator<OverckdNotFoundPage>;
  const createComponent = createComponentFactory(OverckdNotFoundPage);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
