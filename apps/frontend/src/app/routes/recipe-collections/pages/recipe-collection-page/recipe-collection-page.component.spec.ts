import { ActivatedRoute, Router } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { EMPTY } from 'rxjs';
import { RecipeCollectionService } from '../../../../modules/domain/recipe-collection/services/recipe-collection.service';
import { RecipeCollectionPageComponent } from './recipe-collection-page.component';

describe('RecipeCollectionPageComponent', () => {
  let spectator: Spectator<RecipeCollectionPageComponent>;
  const createComponent = createComponentFactory({
    component: RecipeCollectionPageComponent,
    providers: [
      {
        provide: ActivatedRoute,
        useValue: { paramMap: EMPTY },
      },
      {
        provide: Router,
        useValue: { navigate: jest.fn() },
      },
      {
        provide: RecipeCollectionService,
        useValue: { getById: jest.fn().mockReturnValue(EMPTY) },
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
