import { Component, computed, input } from '@angular/core';
import { injectRecipeQueries } from '@overckd-app/recipe/data-access';
import { RecipeId, RecipeNotFound } from '@overckd/domain-experimental';
import { RecipeComponent } from '../../../../modules/domain/recipe/components/recipe/recipe.component';

@Component({
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  imports: [RecipeComponent],
})
export class RecipePageComponent {
  /** The id of the recipe, from the route */
  readonly id = input.required<string>();

  protected readonly recipe = injectRecipeQueries().findById(
    computed(() => ({ id: RecipeId.make(this.id()) })),
  );

  protected readonly notFound = computed(
    () => this.recipe.error() instanceof RecipeNotFound,
  );
}
