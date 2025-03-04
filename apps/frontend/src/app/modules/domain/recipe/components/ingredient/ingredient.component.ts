import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
  input,
} from '@angular/core';
import { RecipeIngredient } from '@overckd/domain';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { IngredientAmountPipe } from '../../../ingredient/modules/ingredient-common/pipes/ingredient-amount.pipe';
import { PortionConverterService } from '../../../portion/modules/portion-common/services/portion-converter.service';

@Component({
  selector: 'overckd-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
  imports: [AsyncPipe, IngredientAmountPipe],
})
export class IngredientComponent implements OnInit, OnChanges {
  readonly #portionConverterService = inject(PortionConverterService);

  /**
   * The ingredient
   */
  readonly ingredient = input.required<RecipeIngredient>();

  /**
   * Scaling factor for the ingredient amount
   */
  readonly amountScale = input(1);

  /**
   * The ingredient
   */
  public ingredient$!: Observable<RecipeIngredient>;
  /**
   * Alternatives for the ingredient
   */
  public alternatives$!: Observable<string | null>;

  private passedIngredient$!: BehaviorSubject<RecipeIngredient>;
  private passedAmountScale$ = new BehaviorSubject<number>(this.amountScale());

  ngOnInit() {
    this.passedIngredient$ = new BehaviorSubject(this.ingredient());
    this.passedAmountScale$.next(this.amountScale());

    // Set up the actual ingredient
    this.ingredient$ = combineLatest([
      this.passedIngredient$.asObservable(),
      this.passedAmountScale$.asObservable(),
    ]).pipe(
      this.#portionConverterService.scaleIngredientAmount$(),
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
          : alternatives!.reduce((acc, cur, i) => {
              let separator = '';

              if (i > 0) {
                separator =
                  i + 1 < (this.ingredient().alternatives?.length ?? 0)
                    ? ', '
                    : ' oder ';
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
