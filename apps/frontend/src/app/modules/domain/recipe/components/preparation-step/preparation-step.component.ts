import { booleanAttribute, Component, input } from '@angular/core';
import { RecipePreparationStep } from '@overckd/domain';

/**
 * Component for displaying a recipe preparation step
 */
@Component({
  selector: 'overckd-preparation-step',
  templateUrl: './preparation-step.component.html',
  styleUrls: ['./preparation-step.component.scss'],
  imports: [],
})
export class PreparationStepComponent {
  readonly step = input.required<RecipePreparationStep>();
  readonly stepsEnumerated = input(false, { transform: booleanAttribute });

  public get isHtml() {
    return !!this.stepHtml;
  }

  public get stepHtml() {
    const { step: stepInput } = this;
    const step = stepInput();
    if (typeof step === 'string') {
      return undefined;
    }

    return step.html;
  }

  public get stepText() {
    const step = this.step();
    return typeof step === 'string' ? step : step.text;
  }

  public get cssClasses() {
    const step = this.step();
    return (typeof step === 'string' ? [] : step.styles || []).join(' ');
  }
}
