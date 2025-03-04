import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Recipe } from '@overckd/domain';
import {
  MatStepper,
  MatStep,
  MatStepLabel,
  MatStepperNext,
} from '@angular/material/stepper';
import { CkadInputFieldComponent } from '../../../../modules/ckapps-design-system/ckad-ui-common/ckad-input/components/input-field/input-field.component';
import { PortionQuantifierInputComponent } from '../../../../modules/domain/portion/modules/portion-input/components/portion-quantifier-input/portion-quantifier-input.component';
import { RecipeInputSourcesListComponent } from '../../../../modules/domain/recipe/modules/recipe-input/components/recipe-input-sources-list/recipe-input-sources-list.component';
import { MatButton } from '@angular/material/button';

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
