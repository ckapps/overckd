import { Router } from '@angular/router';
import { provideEffectRuntime } from '@ckapp/angular-effect';
import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import { CollectionQueries } from '@overckd/collection/application';
import {
  Collection,
  CollectionId,
  RecipeId,
  RecipeRef,
} from '@overckd/domain-experimental';
import { Effect, Layer } from 'effect';
import { RecipesPageComponent } from './recipes.component';

const collection = (id: string, name: string, recipes: Array<string>) =>
  Collection.make({
    id: CollectionId.make(id),
    name,
    description: '',
    recipes: recipes.map(recipe =>
      RecipeRef.make({ id: RecipeId.make(recipe), name: recipe }),
    ),
  });

describe('RecipesPageComponent', () => {
  let spectator: Spectator<RecipesPageComponent>;
  const createComponent = createComponentFactory({
    component: RecipesPageComponent,
    providers: [
      { provide: Router, useValue: { navigate: vi.fn() } },
      provideEffectRuntime(
        Layer.mock(CollectionQueries, {
          getAll: Effect.succeed([
            collection('sweet', 'Sweets', ['Pancakes', 'Waffles']),
            collection('salty', 'Salty', ['Fries']),
          ]),
        }),
      ),
    ],
  });

  beforeEach(async () => {
    spectator = createComponent();
    await spectator.fixture.whenStable();
  });

  it('lists the recipes of every collection', () => {
    expect(spectator.queryAll('h2')).toHaveText(['Sweets', 'Salty']);
    expect(spectator.queryAll('mat-list-item')).toHaveText([
      'Pancakes',
      'Waffles',
      'Fries',
    ]);
  });

  it('opens a recipe by its id', () => {
    spectator.click(spectator.queryAll('mat-list-item')[2]);

    expect(spectator.inject(Router).navigate).toHaveBeenCalledWith([
      '/recipes',
      'recipe',
      'Fries',
    ]);
  });
});
