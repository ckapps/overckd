import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isString } from '@overckd/core';
import { filter, map, switchMap } from 'rxjs/operators';
import { RecipeService } from '../../../../modules/domain/recipe/services/recipe.service';

@Component({
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipePageComponent {
  recipe$ = this.route.paramMap.pipe(
    map(paramMap => paramMap.get('name')),
    filter(isString),
    switchMap(name => this.recipeService.get(name)),
  );

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
  ) {}
}
