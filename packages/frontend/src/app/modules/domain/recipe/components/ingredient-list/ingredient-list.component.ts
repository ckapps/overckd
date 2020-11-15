import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Recipe,
  IngredientGroup,
  Ingredient,
  isIngredientGroup,
  isIngredient,
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
   * Ingredient groups from the passed ingredients
   */
  public ingredientGroups$: Observable<IngredientGroup[]>;
  /**
   * Ingredient list from the passed ingredients
   */
  public ingredientList$: Observable<Ingredient[]>;

  private passedIngredients$: BehaviorSubject<Ingredients>;

  constructor() {}

  ngOnInit() {
    this.passedIngredients$ = new BehaviorSubject(this.ingredients);

    this.ingredientGroups$ = this.passedIngredients$.pipe(
      map(
        ingredients =>
          ingredients.filter(f => isIngredientGroup(f)) as IngredientGroup[],
      ),
    );

    this.ingredientList$ = this.passedIngredients$.pipe(
      map(
        ingredients => ingredients.filter(f => isIngredient(f)) as Ingredient[],
      ),
    );
  }
}
