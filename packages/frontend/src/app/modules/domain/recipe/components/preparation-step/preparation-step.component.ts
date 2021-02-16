import { Component, Input } from '@angular/core';

import { RecipePreparationStep } from '@overckd/domain';

/**
 * Component for displaying a recipe preparation step
 */
@Component({
  selector: 'overckd-preparation-step',
  templateUrl: './preparation-step.component.html',
  styleUrls: ['./preparation-step.component.scss'],
})
export class PreparationStepComponent {
  @Input() step: RecipePreparationStep;
  @Input() stepsEnumerated: boolean;

  public get isHtml() {
    return typeof this.step !== 'string' && !!this.step.html;
  }

  public get stepText() {
    return typeof this.step === 'string' ? this.step : this.step.text;
  }

  public get cssClasses() {
    return (typeof this.step === 'string' ? [] : this.step.styles || []).join(
      ' ',
    );
  }
}
