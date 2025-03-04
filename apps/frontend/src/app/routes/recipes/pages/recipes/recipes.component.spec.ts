import { provideRouter } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { EMPTY } from 'rxjs';
import { RecipeCollectionService } from '../../../../modules/domain/recipe-collection/services/recipe-collection.service';
import { RecipesPageComponent } from './recipes.component';

describe('RecipesComponent', () => {
  let spectator: Spectator<RecipesPageComponent>;
  const createComponent = createComponentFactory({
    component: RecipesPageComponent,
    providers: [
      provideRouter([]),
      {
        provide: RecipeCollectionService,
        useValue: { collections$: EMPTY },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
