import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiModule } from '../../ui/ui.module';
import { IngredientModule } from '../ingredient/ingredient.module';
import { PortionCommonModule } from '../portion/modules/portion-common/portion-common.module';
import { ImprovementNotesComponent } from './components/improvement-notes/improvement-notes.component';
import { IngredientGroupComponent } from './components/ingredient-group/ingredient-group.component';
import { IngredientListComponent } from './components/ingredient-list/ingredient-list.component';
import { IngredientComponent } from './components/ingredient/ingredient.component';
import { PreparationStepComponent } from './components/preparation-step/preparation-step.component';
import { PreparationComponent } from './components/preparation/preparation.component';
import { RecipeTipsComponent } from './components/recipe-tips/recipe-tips.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { RecipeInputModule } from './modules/recipe-input/recipe-input.module';

/**
 * **overckd/module**
 *
 * Module that provides everything for working with `Recipe`s.
 */
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
  ],
  imports: [
    CommonModule,
    FormsModule,
    // External modules
    UiModule,
    IngredientModule,
    PortionCommonModule,
    // Module submodules
    RecipeInputModule,
  ],
  exports: [
    // Module submodules
    RecipeInputModule,
    // Module components
    RecipeComponent,
  ],
})
export class RecipeModule {}
