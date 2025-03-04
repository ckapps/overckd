import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AddRecipePageComponent } from './add-recipe.component';

describe('AddRecipeComponent', () => {
  let spectator: Spectator<AddRecipePageComponent>;
  const createComponent = createComponentFactory({
    component: AddRecipePageComponent,
    providers: [provideNoopAnimations()],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
