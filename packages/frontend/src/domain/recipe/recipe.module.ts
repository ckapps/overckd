import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngredientComponent } from './components/ingredient/ingredient.component';
import { IngredientListComponent } from './components/ingredient-list/ingredient-list.component';
import { PreparationComponent } from './components/preparation/preparation.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { IngredientGroupComponent } from './components/ingredient-group/ingredient-group.component';

import { ImprovementNotesComponent } from './components/improvement-notes/improvement-notes.component';
import { RecipeTipsComponent } from './components/recipe-tips/recipe-tips.component';

@NgModule({
  declarations: [
    IngredientComponent,
    IngredientListComponent,
    PreparationComponent,
    RecipeComponent,
    ImprovementNotesComponent,
    IngredientGroupComponent,
    RecipeTipsComponent,
  ],
  imports: [CommonModule],
  exports: [RecipeComponent],
})
export class RecipeModule {}
