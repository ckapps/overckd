import { booleanAttribute, Component, input } from '@angular/core';
import { PreparationStep } from '@overckd/domain';

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
  readonly step = input.required<PreparationStep.PreparationStep>();
  readonly stepsEnumerated = input(false, { transform: booleanAttribute });
}
