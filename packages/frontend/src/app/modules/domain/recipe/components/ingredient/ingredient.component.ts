import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Ingredient } from '@overckd/domain';

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
   * The ingredient
   */
  public ingredient$: Observable<Ingredient>;
  /**
   * Alternatives for the ingredient
   */
  public alternatives$: Observable<string>;

  private passedIngredient$: BehaviorSubject<Ingredient>;

  constructor() {}

  ngOnInit() {
    this.passedIngredient$ = new BehaviorSubject(this.ingredient);
    this.ingredient$ = this.passedIngredient$.asObservable();

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
