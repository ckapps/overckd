import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import {
  LabelPortionQuantifier,
  PortionKind,
  PortionQuantifier,
  QuantityPortionQuantifier,
  SpringformPortionQuantifier,
} from '@overckd/domain';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { PortionConverterService } from '../../services/portion-converter.service';

/**
 * Component for displaying and changing the portion sizes
 * for a recipe.
 */
@Component({
  selector: 'overckd-portion-converter',
  templateUrl: './portion-converter.component.html',
  styleUrls: ['./portion-converter.component.scss'],
})
export class PortionConverterComponent implements OnInit, OnDestroy {
  @HostBinding('class') componentClasses = [
    'ml-auto',
    'subtitle--v2',
    'text-muted',
    'badge-pill',
  ].join(' ');

  @Input() source: PortionQuantifier;

  /**
   * Emits a value when the scaling factor changes
   */
  @Output() scaleFactorChanged = new EventEmitter<number>();

  public PortionKind = PortionKind;

  private amount$ = new BehaviorSubject(1);
  private destroyed$ = new ReplaySubject<boolean>(1);

  public get amount() {
    return this.amount$.value;
  }

  public set amount(newValue: number) {
    this.amount$.next(newValue);
  }

  public get labelPortionQuantifier() {
    return this.source as LabelPortionQuantifier;
  }

  public get quantityPortionQuantifier() {
    return this.source as QuantityPortionQuantifier;
  }

  public get springformPortionQuantifier() {
    return this.source as SpringformPortionQuantifier;
  }

  constructor(private portionConverterService: PortionConverterService) {}

  ngOnInit(): void {
    // If the recipe has a specified portion quantity, we want to initialze
    // the target amount with the provided portion quantity
    const initialAmount = this.portionConverterService.getPortionQuantity(
      this.source,
    );
    this.amount$.next(initialAmount);

    this.amount$
      .asObservable()
      .pipe(
        takeUntil(this.destroyed$),
        map(amount =>
          this.portionConverterService.calculateScalingFactorFromSource(
            this.source,
            amount,
          ),
        ),
        distinctUntilChanged(),
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
