import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Recipe,
  RecipeIngredientGroup,
  RecipeIngredient,
  isRecipeIngredientGroup,
  isRecipeIngredient,
} from '@overckd/domain';

type Ingredients = Recipe['ingredients'];

@Component({
  selector: 'overckd-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss'],
})
export class IngredientListComponent implements OnInit {
  /**
   * The ingredients to show
   */
  @Input() ingredients: Ingredients;

  /**
   * Scaling factor for the ingredient amount
   */
  @Input() amountScale = 1;

  /**
   * Ingredient groups from the passed ingredients
   */
  public ingredientGroups$: Observable<RecipeIngredientGroup[]>;
  /**
   * Ingredient list from the passed ingredients
   */
  public ingredientList$: Observable<RecipeIngredient[]>;

  private passedIngredients$: BehaviorSubject<Ingredients>;

  constructor() {}

  ngOnInit() {
    this.passedIngredients$ = new BehaviorSubject(this.ingredients);

    this.ingredientGroups$ = this.passedIngredients$.pipe(
      map(
        ingredients =>
          ingredients.filter(f =>
            isRecipeIngredientGroup(f),
          ) as RecipeIngredientGroup[],
      ),
    );

    this.ingredientList$ = this.passedIngredients$.pipe(
      map(
        ingredients =>
          ingredients.filter(f => isRecipeIngredient(f)) as RecipeIngredient[],
      ),
    );
  }
}
