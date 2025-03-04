import {
  Component,
  HostBinding,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortionKind, PortionQuantifier } from '@overckd/domain';
import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  ReplaySubject,
  takeUntil,
} from 'rxjs';
import { PortionConverterService } from '../../services/portion-converter.service';

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
export class PortionConverterComponent implements OnInit, OnDestroy {
  readonly #portionConverterService = inject(PortionConverterService);

  @HostBinding('class') componentClasses = [
    'ml-auto',
    'subtitle--v2',
    'text-muted',
    'badge-pill',
  ].join(' ');

  readonly source = input.required<PortionQuantifier>();

  /**
   * Emits a value when the scaling factor changes
   */
  readonly scaleFactorChanged = output<number>();

  public PortionKind = PortionKind;

  private amount$ = new BehaviorSubject(1);
  private destroyed$ = new ReplaySubject<boolean>(1);

  public get amount() {
    return this.amount$.value;
  }

  public set amount(newValue: number) {
    this.amount$.next(newValue);
  }

  ngOnInit(): void {
    // If the recipe has a specified portion quantity, we want to initialze
    // the target amount with the provided portion quantity
    const initialAmount = this.#portionConverterService.getPortionQuantity(
      this.source(),
    );
    this.amount$.next(initialAmount);

    this.amount$
      .asObservable()
      .pipe(
        map(amount =>
          this.#portionConverterService.calculateScalingFactorFromSource(
            this.source(),
            amount,
          ),
        ),
        distinctUntilChanged(),
        takeUntil(this.destroyed$),
      )
      .subscribe(scaleFactor => {
        this.scaleFactorChanged.emit(scaleFactor);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
