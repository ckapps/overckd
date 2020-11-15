import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ingredient } from '@overckd/domain';
import { PortionConverterService } from '../../services/portion-converter.service';

@Component({
  selector: 'overckd-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
})
export class IngredientComponent implements OnInit, OnChanges {
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

  constructor(private portionConverterService: PortionConverterService) {}

  ngOnInit() {
    this.passedIngredient$ = new BehaviorSubject(this.ingredient);
    this.passedAmountScale$.next(this.amountScale);

    // Set up the actual ingredient
    this.ingredient$ = combineLatest([
      this.passedIngredient$.asObservable(),
      this.passedAmountScale$.asObservable(),
    ]).pipe(
      this.portionConverterService.scaleIngredientAmount$(),
      map(([ingredient, amount]) => ({
        ...ingredient,
        amount,
      })),
    );

    // Set up alternatives$
    this.alternatives$ = this.passedIngredient$.pipe(
      map(({ alternatives }) =>
        (alternatives || []).length === 0
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

  ngOnChanges(changes: SimpleChanges): void {
    const { amountScale } = changes;
    if (amountScale && !amountScale.firstChange) {
      this.passedAmountScale$.next(amountScale.currentValue);
    }
  }
}
