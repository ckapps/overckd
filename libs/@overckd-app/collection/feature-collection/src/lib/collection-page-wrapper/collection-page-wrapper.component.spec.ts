import { provideRouter } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import { CollectionPageWrapperComponent } from './collection-page-wrapper.component';

describe('CollectionPageWrapperComponent', () => {
  let spectator: Spectator<CollectionPageWrapperComponent>;
  const createComponent = createComponentFactory({
    component: CollectionPageWrapperComponent,
    providers: [provideRouter([])],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
