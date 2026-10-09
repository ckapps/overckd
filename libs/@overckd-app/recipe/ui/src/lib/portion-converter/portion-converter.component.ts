import {
  Component,
  computed,
  effect,
  HostBinding,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Portion } from '@overckd/domain-experimental';
import { Option } from 'effect';

/**
 * Component for displaying and changing the portion sizes
 * for a recipe.
 */
@Component({
  selector: 'overckd-portion-converter',
  templateUrl: './portion-converter.component.html',
  styleUrls: ['./portion-converter.component.scss'],
  imports: [FormsModule],
})
export class PortionConverterComponent {
  @HostBinding('class') componentClasses = [
    'ml-auto',
    'subtitle--v2',
    'text-muted',
    'badge-pill',
  ].join(' ');

  readonly source = input.required<Portion.Portion>();

  /**
   * Emits a value when the scaling factor changes
   */
  readonly scaleFactorChanged = output<number>();

  /**
   * The target amount, initially the quantity of the source portion
   */
  protected readonly amount = linkedSignal(() =>
    Portion.getQuantity(this.source()),
  );

  protected readonly label = computed(() => {
    const source = this.source();
    return source.kind === Portion.PortionKind.Quantity
      ? Option.getOrUndefined(source.label)
      : undefined;
  });

  constructor() {
    // An amount that isn't positive keeps the last scaling factor
    effect(() => {
      const scaleFactor = Portion.scaleFactorTo(this.source(), this.amount());
      if (Option.isSome(scaleFactor)) {
        this.scaleFactorChanged.emit(scaleFactor.value);
      }
    });
  }
}
