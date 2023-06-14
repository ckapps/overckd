import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as P from 'effect/Predicate';
import { filter, map, switchMap } from 'rxjs';
import { RecipeService } from '../../../../modules/domain/recipe/services/recipe.service';

@Component({
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipePageComponent {
  recipe$ = this.route.paramMap.pipe(
    map(paramMap => paramMap.get('name')),
    filter(P.isString),
    switchMap(name => this.recipeService.get(name)),
  );

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
  ) {}
}
