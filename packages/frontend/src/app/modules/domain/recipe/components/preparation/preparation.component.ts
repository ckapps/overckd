import { Component, OnInit, Input } from '@angular/core';

import { Recipe } from '@overckd/domain';

@Component({
  selector: 'overckd-preparation',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss'],
})
export class PreparationComponent implements OnInit {
  @Input() recipe: Recipe;

  constructor() {}

  ngOnInit() {}

  public get steps() {
    return this.recipe.steps;
  }

  public get asList() {
    return Array.isArray(this.steps);
  }
}
