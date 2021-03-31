import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Recipe } from '@overckd/domain';

import { RecipeService } from 'src/app/modules/domain/recipe/services/recipe.service';

@Component({
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipePageComponent implements OnInit {
  recipe$: Observable<Recipe>;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
  ) {}

  ngOnInit() {
    this.recipe$ = this.route.paramMap.pipe(
      switchMap(paramMap => this.recipeService.get(paramMap.get('name'))),
    );
  }
}
