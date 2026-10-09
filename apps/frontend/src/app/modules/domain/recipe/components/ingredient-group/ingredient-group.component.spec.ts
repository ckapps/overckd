import { createHostFactory, SpectatorHost } from '@ngneat/spectator/vitest';
import { IngredientGroupComponent } from './ingredient-group.component';

describe('IngredientGroupComponent', () => {
  let spectator: SpectatorHost<IngredientGroupComponent>;
  const createHost = createHostFactory(IngredientGroupComponent);

  it('shows the label above the ingredient list', () => {
    spectator = createHost(
      `<overckd-ingredient-group label="For the dough">
        <overckd-ingredient-list>Flour</overckd-ingredient-list>
      </overckd-ingredient-group>`,
    );

    expect(spectator.query('h6')).toHaveText('For the dough');
    expect(spectator.query('overckd-ingredient-list')).toHaveText('Flour');
  });
});
