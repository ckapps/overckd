import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Recipe, IngredientGroup } from '@overckd/domain';

/**
 * Component to display a recipe
 */
@Component({
  selector: 'overckd-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  @HostBinding('class') componentClass = 'container-fluid';
  @Input() recipe: Recipe;
  @Input() numberOfLines = 5;

  public recipe$: BehaviorSubject<Recipe>;
  public ingredients$: Observable<Recipe['ingredients']>;

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

  constructor() {}

  ngOnInit() {
    this.recipe$ = new BehaviorSubject(this.recipe);

    this.ingredients$ = this.recipe$.pipe(
      map(recipe => {
        const { groups } = recipe;
        const ingredientGroups = groups
          ? groups.map<IngredientGroup>(g => ({
              label: g.label,
              group: g.name,
              ingredients: g.ingredients,
            }))
          : [];

        return [...ingredientGroups, ...recipe.ingredients];
      }),
    );
  }

  get primaryImage() {
    return this.recipe.images[0];
  }

  get secondaryImages() {
    return this.recipe.images.filter((_, i) => i !== 0);
  }

  getImageCssClass(index: number) {
    const { images } = this.recipe.styles;

    return (images && images[index]) || 'w-100';
  }

  get dividerCssClass() {
    return ['w-75', 'align-self-center', 'my-3'].join(' ');
  }

  get primaryImageContainerCssClass() {
    return ['d-flex', 'col', this.recipe.styles.imagesContainer || ''].join(
      ' ',
    );
  }

  get secondaryImageContainerCssClass() {
    return [
      'col',
      this.secondaryImages.length > 0 ? 'd-flex' : 'd-none',
      this.recipe.styles.secondaryImagesContainer || 'flex-column',
    ].join(' ');
  }

  public onScaleFactorChanged(scaleFactor: number) {
    this.portionScaling = scaleFactor;
  }
}
