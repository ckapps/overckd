import { Component } from '@angular/core';
import { Recipe } from '@overckd/domain';
import { RecipeComponent } from '../../../../modules/domain/recipe/components/recipe/recipe.component';

function generateEmpty<T>(count: number, object: T): T[] {
  const result = [];

  for (let i = count; i > 0; --i) {
    result.push(object);
  }

  return result;
}

@Component({
  templateUrl: './empty-recipe.component.html',
  styleUrls: ['./empty-recipe.component.scss'],
  imports: [RecipeComponent],
})
export class EmptyRecipePageComponent {
  recipe: Recipe = {
    name: generateEmpty(25, '').join(' '),
    tips: generateEmpty(3, '<br /><br />'),
    steps: [],
    ingredients: generateEmpty(15, { name: '' }),
    images: [],
    styles: {
      title: 'w-100 border-bottom',
    },
  };
}
