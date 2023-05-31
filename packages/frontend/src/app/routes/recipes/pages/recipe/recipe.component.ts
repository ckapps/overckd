import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RecipeService } from 'src/app/modules/domain/recipe/services/recipe.service';

@Component({
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipePageComponent {
  recipe$ = this.route.paramMap.pipe(
    switchMap(paramMap => this.recipeService.get(paramMap.get('name'))),
  );

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
  ) {}
}
