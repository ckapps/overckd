import { RecipeComponent } from '@overckd-app/recipe/ui';
import { Component } from '@angular/core';
import {
  IngredientId,
  NonEmptyHtmlString,
  RecipeId,
  RecipeIngredient,
  RecipePreparation,
} from '@overckd/domain-experimental';
import { Array as Arr, Option } from 'effect';

/** Blank space, to write on by hand */
const blank = ' ';

const blankIngredient = RecipeIngredient.make({
  uri: IngredientId.make('blank'),
  name: blank,
  amount: Option.none(),
  optional: false,
  alternatives: [],
});

/**
 * A recipe to print and fill in by hand: room for the name, 15 ingredients,
 * three tips and the notes.
 */
@Component({
  templateUrl: './empty-recipe.component.html',
  styleUrls: ['./empty-recipe.component.scss'],
  imports: [RecipeComponent],
})
export class EmptyRecipePageComponent {
  readonly recipe: RecipePreparation = {
    _tag: 'BasicRecipePreparation',
    id: RecipeId.make('print-template'),
    name: blank.repeat(24),
    tips: Arr.replicate('<br /><br />', 3),
    basedOn: [],
    ingredients: Arr.replicate(blankIngredient, 15),
    steps: [{ instruction: NonEmptyHtmlString.make(blank) }],
    stepsEnumerated: false,
    portion: { kind: 'quantity', label: Option.none(), quantity: 1 },
    images: [],
  };
}
