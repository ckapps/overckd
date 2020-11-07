import { Component, OnInit, Input } from '@angular/core';

import { Recipe, Ingredient, IngredientGroup } from '@overckd/domain';

type Ingredients = Recipe['ingredients'];

@Component({
  selector: 'cb-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss'],
})
export class IngredientListComponent implements OnInit {
  @Input() ingredients: Ingredients;

  constructor() {}

  ngOnInit() {}

  public isIngredientGroup(
    o: Ingredient | IngredientGroup,
  ): o is IngredientGroup {
    // tslint:disable-next-line
    return Array.isArray(o['ingredients']);
  }

  public get ingredientGroups() {
    return this.ingredients.filter(f => this.isIngredientGroup(f));
  }

  public get ingredientList() {
    return this.ingredients.filter(f => !this.isIngredientGroup(f));
  }
}
