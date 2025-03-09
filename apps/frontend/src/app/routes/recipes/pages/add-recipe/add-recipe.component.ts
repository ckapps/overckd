import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
} from '@angular/material/stepper';
import { CkadInputFieldComponent } from '@ckapp/ckad-angular/input';
import { Recipe } from '@overckd/domain';
import { PortionQuantifierInputComponent } from '../../../../modules/domain/portion/modules/portion-input/components/portion-quantifier-input/portion-quantifier-input.component';
import { RecipeInputSourcesListComponent } from '../../../../modules/domain/recipe/modules/recipe-input/components/recipe-input-sources-list/recipe-input-sources-list.component';

@Component({
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
  imports: [
    MatStepper,
    MatStep,
    FormsModule,
    ReactiveFormsModule,
    MatStepLabel,
    CkadInputFieldComponent,
    PortionQuantifierInputComponent,
    RecipeInputSourcesListComponent,
    MatButton,
    MatStepperNext,
  ],
})
export class AddRecipePageComponent {
  public recipeBaseForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    portionQuantifier: new FormControl(''),
    basedOn: new FormControl<Recipe['basedOn']>([]),
  });
}
