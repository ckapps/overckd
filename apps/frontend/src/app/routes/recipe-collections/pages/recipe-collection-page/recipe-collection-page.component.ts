import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { injectCollectionQueries } from '@overckd-app/collection/data-access';
import { CollectionRecipeListComponent } from '@overckd-app/collection/ui';
import {
  CollectionId,
  CollectionNotFound,
  RecipeRef,
} from '@overckd/domain-experimental';

@Component({
  templateUrl: './recipe-collection-page.component.html',
  styleUrls: ['./recipe-collection-page.component.scss'],
  imports: [CollectionRecipeListComponent],
})
export class RecipeCollectionPageComponent {
  /** The id of the collection, from the route */
  readonly id = input.required<string>();

  readonly #router = inject(Router);

  protected readonly collection = injectCollectionQueries().findById(
    computed(() => ({ id: CollectionId.make(this.id()) })),
  );

  protected readonly notFound = computed(
    () => this.collection.error() instanceof CollectionNotFound,
  );

  protected onRecipeSelected(recipe: RecipeRef) {
    void this.#router.navigate(['/recipes', 'recipe', recipe.id]);
  }
}
