import { Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import {
  faCarrot,
  faPlusCircle,
  faShoppingBasket,
} from '@fortawesome/free-solid-svg-icons';
import { Ingredient, IngredientQuery } from '@overckd/domain';
import {
  mapToUriArray,
  switchMapFilterFromUris,
} from '@overckd/domain/dist/rxjs/uri';
import { BehaviorSubject, Subject } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';

import { IngredientService } from '../../../ingredient-common/services/ingredient.service';

@Component({
  selector: 'overckd-ingredient-list-input',
  templateUrl: './ingredient-list-input.component.html',
  styleUrls: ['./ingredient-list-input.component.scss'],
})
export class IngredientListInputComponent {
  private ingredientQuerySubject = new Subject<IngredientQuery>();
  private selectedIngredientsSubject = new BehaviorSubject<Ingredient[]>([]);

  /**
   * Observable that emits the selected ingredients
   */
  public selectedIngredients$ = this.selectedIngredientsSubject.asObservable();

  /**
   * Observable that emits the URIs of the selected ingredients
   */
  private selectedIngredientUris$ = this.selectedIngredients$.pipe(
    mapToUriArray(),
  );

  /**
   * Observable that emits the Ingredient Query
   */
  private ingredientQuery$ = this.ingredientQuerySubject.asObservable();

  /**
   * Filtered ingredients
   */
  public filteredIngredients$ = this.ingredientQuery$.pipe(
    switchMap(query => this.ingredientService.findByQuery(query)),
    pluck('result'),
    switchMapFilterFromUris(this.selectedIngredientUris$),
  );

  public emptyByQueryIcon = faCarrot;
  public emptyByNoSelectionIcon = faShoppingBasket;
  public selectedIcon = faShoppingBasket;
  public newIngredientIcon = faPlusCircle;

  constructor(private ingredientService: IngredientService) {}

  public onAddedFromInput(ingredient: string) {
    this.addIngredient({ name: ingredient, tags: [] });
  }

  public onAddedFromSelection(ingredient: Ingredient) {
    this.addIngredient(ingredient);
  }

  public onRemoved(ingredient: Ingredient) {
    this.removeIngredient(ingredient);
  }

  public onQueryChanged(query: IngredientQuery) {
    this.ingredientQuerySubject.next(query);
  }

  public onSelectionChanged(e: MatSelectionListChange) {
    const { options } = e;

    for (const o of options) {
      const { selected, value } = o;
      if (selected) {
        this.addIngredient(value);
      } else {
        this.removeIngredient(value);
      }
    }
  }

  /**
   * Adds tag to selection
   *
   * @param ingredient Tag to add
   */
  private addIngredient(ingredient: Ingredient) {
    this.selectedIngredientsSubject.next([
      ...this.selectedIngredientsSubject.value,
      ingredient,
    ]);
  }

  /**
   * Removes tag from selection
   * @param ingredient Tag to remove
   */
  private removeIngredient(ingredient: Ingredient) {
    const index = this.selectedIngredientsSubject.value.indexOf(ingredient);

    if (index >= 0) {
      this.selectedIngredientsSubject.next(
        this.selectedIngredientsSubject.value.filter((_, i) => i !== index),
      );
    }
  }
}
