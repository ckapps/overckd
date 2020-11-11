import { Component, OnInit, Input, HostBinding } from '@angular/core';

import { Recipe } from '@overckd/domain';

@Component({
  selector: 'overckd-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  @HostBinding('class') componentClass = 'container-fluid';
  @Input() recipe: Recipe;
  @Input() numberOfLines = 5;

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

  ngOnInit() {}

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
}
