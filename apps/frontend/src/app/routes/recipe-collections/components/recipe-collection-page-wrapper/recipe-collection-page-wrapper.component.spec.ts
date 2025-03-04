import { provideRouter } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RecipeCollectionPageWrapperComponent } from './recipe-collection-page-wrapper.component';

describe('RecipeCollectionPageWrapperComponent', () => {
  let spectator: Spectator<RecipeCollectionPageWrapperComponent>;
  const createComponent = createComponentFactory({
    component: RecipeCollectionPageWrapperComponent,
    providers: [provideRouter([])],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
