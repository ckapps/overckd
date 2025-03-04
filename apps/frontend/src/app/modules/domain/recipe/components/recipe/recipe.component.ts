import { AsyncPipe } from '@angular/common';
import { Component, computed, HostBinding, input } from '@angular/core';
import { Recipe, RecipeIngredientGroup } from '@overckd/domain';
import { PortionConverterComponent } from '../../../portion/modules/portion-common/components/portion-converter/portion-converter.component';
import { ImprovementNotesComponent } from '../improvement-notes/improvement-notes.component';
import { IngredientListComponent } from '../ingredient-list/ingredient-list.component';
import { PreparationComponent } from '../preparation/preparation.component';
import { RecipeTipsComponent } from '../recipe-tips/recipe-tips.component';

/**
 * Component to display a recipe
 */
@Component({
  selector: 'overckd-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  imports: [
    PortionConverterComponent,
    IngredientListComponent,
    RecipeTipsComponent,
    ImprovementNotesComponent,
    PreparationComponent,
    AsyncPipe,
  ],
})
export class RecipeComponent {
  @HostBinding('class') componentClass = 'container-fluid';
  readonly recipe = input.required<Recipe>();
  readonly numberOfLines = input(5);

  readonly ingredients = computed<Recipe['ingredients']>(() => {
    const recipe = this.recipe();
    const { groups } = recipe;
    const ingredientGroups = groups
      ? groups.map<RecipeIngredientGroup>(g => ({
          label: g.label,
          group: g.name,
          ingredients: g.ingredients,
        }))
      : [];

    return [...ingredientGroups, ...recipe.ingredients];
  });

  /**
   * This is the target amount for the portion size
   */
  public portionScaling = 1;

  public get leftColCssClass() {
    const justify = true;

    return [
      'col-4',
      'd-flex',
      'flex-column',
      'border-right',
      'mr-5',
      justify ? 'justify-content-between' : '',
    ].join(' ');
  }

  get primaryImage() {
    return this.recipe().images[0];
  }

  get secondaryImages() {
    return this.recipe().images.filter((_, i) => i !== 0);
  }

  getImageCssClass(index: number) {
    const { images } = this.recipe().styles;

    return (images && images[index]) || 'w-100';
  }

  get dividerCssClass() {
    return ['w-75', 'align-self-center', 'my-3'].join(' ');
  }

  get primaryImageContainerCssClass() {
    return ['d-flex', 'col', this.recipe().styles.imagesContainer || ''].join(
      ' ',
    );
  }

  get secondaryImageContainerCssClass() {
    return [
      'col',
      this.secondaryImages.length > 0 ? 'd-flex' : 'd-none',
      this.recipe().styles.secondaryImagesContainer || 'flex-column',
    ].join(' ');
  }

  public onScaleFactorChanged(scaleFactor: number) {
    this.portionScaling = scaleFactor;
  }
}
