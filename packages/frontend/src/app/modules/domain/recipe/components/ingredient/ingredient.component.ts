import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ingredient } from '@overckd/domain';

function scaledAmount(i: Ingredient, scalar: number) {
  const { amount, scaleFactor = 1 } = i;

  if (typeof amount !== 'number' || scalar === 1) {
    return amount;
  }

  // Factor in the ingredient specific scale factor
  return amount + amount * (scalar - 1) * scaleFactor;
}

@Component({
  selector: 'overckd-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
})
export class IngredientComponent implements OnInit {
  /**
   * The ingredient
   */
  @Input() ingredient: Ingredient;

  /**
   * Scaling factor for the ingredient amount
   */
  @Input() amountScale = 1;

  /**
   * The ingredient
   */
  public ingredient$: Observable<Ingredient>;
  /**
   * Alternatives for the ingredient
   */
  public alternatives$: Observable<string>;

  private passedIngredient$: BehaviorSubject<Ingredient>;
  private passedAmountScale$ = new BehaviorSubject<number>(this.amountScale);

  constructor() {}

  ngOnInit() {
    this.passedIngredient$ = new BehaviorSubject(this.ingredient);
    this.passedAmountScale$.next(this.amountScale);

    // Set up the actual ingredient
    this.ingredient$ = combineLatest([
      this.passedIngredient$.asObservable(),
      this.passedAmountScale$.asObservable(),
    ]).pipe(
      map(([ingredient, overallScaleFactor]) => ({
        ...ingredient,
        amount: scaledAmount(ingredient, overallScaleFactor),
      })),
    );

    // Set up alternatives$
    this.alternatives$ = this.passedIngredient$.pipe(
      map(({ alternatives }) =>
        alternatives.length === 0
          ? null
          : alternatives.reduce((acc, cur, i) => {
              let separator = '';

              if (i > 0) {
                separator =
                  i + 1 < this.ingredient.alternatives.length ? ', ' : ' oder ';
              }

              return `${acc}${separator}${cur}`;
            }, ''),
      ),
    );
  }
}
