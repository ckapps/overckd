import { Component, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CkadInputFieldComponent } from '@ckapp/ckad-angular/input';
import { RecipeBaseLink } from '@overckd/domain';

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
