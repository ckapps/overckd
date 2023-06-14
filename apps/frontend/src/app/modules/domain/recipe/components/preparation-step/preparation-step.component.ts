import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
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
  @Input() step!: RecipePreparationStep;
  @Input() get stepsEnumerated() {
    return this._stepsEnumerated;
  }
  set stepsEnumerated(value: BooleanInput) {
    this._stepsEnumerated = coerceBooleanProperty(value);
  }
  private _stepsEnumerated = false;

  public get isHtml() {
    return !!this.stepHtml;
  }

  public get stepHtml() {
    const { step } = this;
    if (typeof step === 'string') {
      return undefined;
    }

    return step.html;
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
