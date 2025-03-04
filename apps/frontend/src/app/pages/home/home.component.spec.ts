import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { HomePageComponent } from './home.component';

describe('HomeComponent', () => {
  let spectator: Spectator<HomePageComponent>;
  const createComponent = createComponentFactory(HomePageComponent);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
