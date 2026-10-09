import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { injectCollectionQueries } from '@overckd-app/collection/data-access';
import { CollectionRecipeListComponent } from '@overckd-app/collection/ui';
import { RecipeRef } from '@overckd/domain';

@Component({
  templateUrl: './recipes-page.component.html',
  styleUrls: ['./recipes-page.component.scss'],
  imports: [CollectionRecipeListComponent],
})
export class RecipesPageComponent {
  readonly #router = inject(Router);

  readonly #collections = injectCollectionQueries().getAll();

  /** The collections, or none while they load or when they failed to load */
  protected readonly collections = computed(() =>
    this.#collections.hasValue() ? this.#collections.value() : [],
  );

  protected onRecipeSelected(recipe: RecipeRef) {
    void this.#router.navigate(['/recipes', 'recipe', recipe.id]);
  }
}
