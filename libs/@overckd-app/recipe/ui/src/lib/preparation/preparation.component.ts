import { Component, computed, input } from '@angular/core';
import { PreparationStep, RecipePreparation } from '@overckd/domain';
import { recipeParts } from '../recipe-parts';
import { PreparationStepComponent } from '../preparation-step/preparation-step.component';

interface PreparationGroup {
  readonly label: string | undefined;
  readonly steps: ReadonlyArray<PreparationStep>;
  readonly stepsEnumerated: boolean;
  /** The number of the first step */
  readonly start: number;
}

/**
 * Component for displaying recipe preparation steps
 */
@Component({
  selector: 'overckd-preparation',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss'],
  imports: [PreparationStepComponent],
})
export class PreparationComponent {
  readonly recipe = input.required<RecipePreparation>();

  /**
   * The steps of every part, numbered across the parts. With groups, the
   * recipe's own steps come last, as further preparation.
   */
  protected readonly preparationGroups = computed(() => {
    const parts = recipeParts(this.recipe());
    const hasGroups = parts.some(({ label }) => label !== undefined);
    let start = 1;

    return parts.map(({ label, recipe }): PreparationGroup => {
      const group = {
        label: label ?? (hasGroups ? 'Weitere Zubereitung' : undefined),
        steps: recipe.steps,
        stepsEnumerated: recipe.stepsEnumerated,
        start,
      };
      start += recipe.steps.length;

      return group;
    });
  });
}
