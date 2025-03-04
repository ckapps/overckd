import { ActivatedRoute } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { RecipeService } from '../../../../modules/domain/recipe/services/recipe.service';
import { RecipePageComponent } from './recipe.component';

describe('RecipesComponent', () => {
  let spectator: Spectator<RecipePageComponent>;
  const createComponent = createComponentFactory({
    component: RecipePageComponent,
    providers: [
      {
        provide: ActivatedRoute,
        useValue: { paramMap: of({ get: jest.fn().mockReturnValue('param') }) },
      },
      {
        provide: RecipeService,
        useValue: {},
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
