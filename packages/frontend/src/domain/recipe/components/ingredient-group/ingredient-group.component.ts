import { Component, OnInit, Input } from '@angular/core';

import { IngredientGroup } from '@overckd/domain';

@Component({
  selector: 'cb-ingredient-group',
  templateUrl: './ingredient-group.component.html',
  styleUrls: ['./ingredient-group.component.scss'],
})
export class IngredientGroupComponent implements OnInit {
  @Input() ingredientGroup: IngredientGroup;
  constructor() {}

  ngOnInit() {}
}
