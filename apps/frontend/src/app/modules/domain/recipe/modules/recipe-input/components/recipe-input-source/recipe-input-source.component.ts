import { Component, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipeBaseLink } from '@overckd/domain';
import { CkadInputFieldComponent } from '../../../../../../ckapps-design-system/ckad-ui-common/ckad-input/components/input-field/input-field.component';

@Component({
  selector: 'overckd-recipe-input-source',
  templateUrl: './recipe-input-source.component.html',
  styleUrls: ['./recipe-input-source.component.scss'],
  imports: [CkadInputFieldComponent, FormsModule],
})
export class RecipeInputSourceComponent {
  readonly itemChanged = output<RecipeBaseLink>();

  readonly url = model<RecipeBaseLink>('null');
}
