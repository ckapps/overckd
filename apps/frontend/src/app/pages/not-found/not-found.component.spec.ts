import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NotFoundPageComponent } from './not-found.component';

describe('EmptyComponent', () => {
  let spectator: Spectator<NotFoundPageComponent>;
  const createComponent = createComponentFactory(NotFoundPageComponent);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
