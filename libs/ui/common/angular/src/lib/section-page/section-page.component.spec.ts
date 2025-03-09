import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { OverckdCommonSectionPage } from './section-page.component';

describe('OverckdCommonSectionPage', () => {
  let spectator: Spectator<OverckdCommonSectionPage>;
  const createComponent = createComponentFactory(OverckdCommonSectionPage);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
