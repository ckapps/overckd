import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Recipe } from '@overckd/domain';

@Component({
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
})
export class AddRecipePageComponent {
  public recipeBaseForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    portionQuantifier: new FormControl(''),
    basedOn: new FormControl<Recipe['basedOn']>([]),
  });
}
