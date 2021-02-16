import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// External modules
import { UiModule } from '../../ui/ui.module';

// Components
import { IngredientComponent } from './components/ingredient/ingredient.component';
import { IngredientListComponent } from './components/ingredient-list/ingredient-list.component';
import { PreparationComponent } from './components/preparation/preparation.component';
import { PreparationStepComponent } from './components/preparation-step/preparation-step.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { IngredientGroupComponent } from './components/ingredient-group/ingredient-group.component';

import { ImprovementNotesComponent } from './components/improvement-notes/improvement-notes.component';
import { RecipeTipsComponent } from './components/recipe-tips/recipe-tips.component';
import { PortionConverterComponent } from './components/portion-converter/portion-converter.component';
import { IngredientModule } from '../ingredient/ingredient.module';

@NgModule({
  declarations: [
    IngredientComponent,
    IngredientListComponent,
    PreparationComponent,
    PreparationStepComponent,
    RecipeComponent,
    ImprovementNotesComponent,
    IngredientGroupComponent,
    RecipeTipsComponent,
    PortionConverterComponent,
  ],
  imports: [CommonModule, FormsModule, UiModule, IngredientModule],
  exports: [RecipeComponent],
})
export class RecipeModule {}
