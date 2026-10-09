import { RecipeComponent } from '@overckd-app/recipe/ui';
import { Component, computed, input } from '@angular/core';
import { injectRecipeQueries } from '@overckd-app/recipe/data-access';
import { RecipeId, RecipeNotFound } from '@overckd/domain';

@Component({
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss'],
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
