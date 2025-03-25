import { SharedUiModule } from '@_shared/ui';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { CkadUiCommonModule } from '../../modules/ckapps-design-system/ckad-ui-common/ckad-ui-common.module';
import { DomainModule } from '../../modules/domain/domain.module';
import { AddRecipePageComponent } from './pages/add-recipe/add-recipe.component';
import { EmptyRecipePageComponent } from './pages/empty-recipe/empty-recipe.component';
import { RecipePageComponent } from './pages/recipe/recipe.component';
import { RecipesPagesWrapperComponent } from './pages/recipes-pages-wrapper.component';
import { RecipesPageComponent } from './pages/recipes/recipes.component';
import { RecipesRoutingModule } from './recipes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    RecipesRoutingModule,
    DomainModule,
    CkadUiCommonModule,
    SharedUiModule,
    AddRecipePageComponent,
    EmptyRecipePageComponent,
    RecipePageComponent,
    RecipesPageComponent,
    RecipesPagesWrapperComponent,
  ],
})
export class RecipesModule {}
