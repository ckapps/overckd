import { Component, computed, input } from '@angular/core';
import {
  RecipeIngredient,
  RecipeIngredientGroup,
} from '@overckd/domain-experimental';
import { Predicate } from 'effect';
import { IngredientGroupComponent } from '../ingredient-group/ingredient-group.component';
import { IngredientComponent } from '../ingredient/ingredient.component';

type Ingredients = ReadonlyArray<RecipeIngredient | RecipeIngredientGroup>;

const isGroup = (
  item: RecipeIngredient | RecipeIngredientGroup,
): item is RecipeIngredientGroup =>
  Predicate.isTagged(item, 'RecipeIngredientGroup');

const isIngredient = (
  item: RecipeIngredient | RecipeIngredientGroup,
): item is RecipeIngredient => !isGroup(item);

/**
 * Lists ingredients: the groups first, then the other ingredients
 */
@Component({
  selector: 'overckd-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss'],
  imports: [IngredientGroupComponent, IngredientComponent],
})
export class IngredientListComponent {
  /**
   * The ingredients to show
   */
  readonly ingredients = input.required<Ingredients>();

  /**
   * Scaling factor for the ingredient amount
   */
  readonly amountScale = input(1);

  /**
   * Ingredient groups from the passed ingredients
   */
  protected readonly ingredientGroups = computed(() =>
    this.ingredients().filter(isGroup),
  );

  /**
   * Ingredient list from the passed ingredients
   */
  protected readonly ingredientList = computed(() =>
    this.ingredients().filter(isIngredient),
  );
}
