import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { OverckdCommonPage } from './page.component';

describe('OverckdCommonPage', () => {
  let spectator: Spectator<OverckdCommonPage>;
  const createComponent = createComponentFactory(OverckdCommonPage);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
