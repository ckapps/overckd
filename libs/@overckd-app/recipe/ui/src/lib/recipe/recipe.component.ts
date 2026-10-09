import { Component, computed, HostBinding, input, signal } from '@angular/core';
import { RecipePreparation } from '@overckd/domain';
import { Option } from 'effect';
import { PortionConverterComponent } from '../portion-converter/portion-converter.component';
import { RecipePart, recipeParts } from '../recipe-parts';
import { ImprovementNotesComponent } from '../improvement-notes/improvement-notes.component';
import { IngredientGroupComponent } from '../ingredient-group/ingredient-group.component';
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
    IngredientGroupComponent,
    IngredientListComponent,
    RecipeTipsComponent,
    ImprovementNotesComponent,
    PreparationComponent,
  ],
})
export class RecipeComponent {
  @HostBinding('class') componentClass = 'container-fluid';
  readonly recipe = input.required<RecipePreparation>();
  readonly numberOfLines = input(5);

  /**
   * Classes for the title, in addition to its own
   */
  readonly titleClass = input('');

  protected readonly parts = computed(() => recipeParts(this.recipe()));

  /**
   * The groups of a union recipe; their ingredients come first
   */
  protected readonly groups = computed(() =>
    this.parts().filter(
      (part): part is RecipePart & { readonly label: string } =>
        part.label !== undefined,
    ),
  );

  /**
   * The recipe's own part
   */
  protected readonly ownParts = computed(() =>
    this.parts().filter(part => part.label === undefined),
  );

  /**
   * A recipe without a portion has one unlabeled portion, which isn't worth
   * converting
   */
  protected readonly showPortion = computed(() => {
    const { portion } = this.recipe();

    return !(
      portion.kind === 'quantity' &&
      portion.quantity === 1 &&
      Option.isNone(portion.label)
    );
  });

  /**
   * This is the target amount for the portion size
   */
  protected readonly portionScaling = signal(1);

  protected readonly primaryImage = computed(() => this.recipe().images[0]);

  protected readonly secondaryImages = computed(() =>
    this.recipe().images.slice(1),
  );

  protected readonly leftColCssClass = [
    'col-4',
    'd-flex',
    'flex-column',
    'border-right',
    'mr-5',
    'justify-content-between',
  ].join(' ');

  protected readonly dividerCssClass = [
    'w-75',
    'align-self-center',
    'my-3',
  ].join(' ');

  protected readonly secondaryImageContainerCssClass = computed(() =>
    [
      'col',
      this.secondaryImages().length > 0 ? 'd-flex' : 'd-none',
      'flex-column',
    ].join(' '),
  );
}
