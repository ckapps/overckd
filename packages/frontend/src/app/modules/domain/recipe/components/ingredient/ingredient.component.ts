import { Component, OnInit, Input } from '@angular/core';

import { Ingredient } from '@overckd/domain';

@Component({
  selector: 'overckd-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
})
export class IngredientComponent implements OnInit {
  @Input() ingredient: Ingredient;
  constructor() {}

  ngOnInit() {}

  get alternatives() {
    return this.ingredient.alternatives.reduce((acc, cur, i) => {
      let separator = '';

      if (i > 0) {
        separator =
          i + 1 < this.ingredient.alternatives.length ? ', ' : ' oder ';
      }

      return `${acc}${separator}${cur}`;
    }, '');
  }
}
