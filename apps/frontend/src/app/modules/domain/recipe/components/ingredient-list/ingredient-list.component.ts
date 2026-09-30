import { AsyncPipe } from '@angular/common';
import { Component, OnInit, input } from '@angular/core';
import {
  Recipe,
  RecipeIngredient,
  RecipeIngredientGroup,
  isRecipeIngredient,
  isRecipeIngredientGroup,
} from '@overckd/domain';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { IngredientGroupComponent } from '../ingredient-group/ingredient-group.component';
import { IngredientComponent } from '../ingredient/ingredient.component';

type Ingredients = Recipe['ingredients'];

@Component({
  selector: 'overckd-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss'],
  imports: [IngredientGroupComponent, IngredientComponent, AsyncPipe],
})
export class IngredientListComponent implements OnInit {
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
  public ingredientGroups$!: Observable<RecipeIngredientGroup[]>;
  /**
   * Ingredient list from the passed ingredients
   */
  public ingredientList$!: Observable<RecipeIngredient[]>;

  private passedIngredients$!: BehaviorSubject<Ingredients>;

  ngOnInit() {
    this.passedIngredients$ = new BehaviorSubject(this.ingredients());

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
