import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { PortionKind } from '@overckd/domain';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PortionQuantifierService } from '../../../portion-common/services/portion-quantifier.service';

export interface PortionQuantifier {
  kind: PortionKind.Label;
  quantity: number | null;
  label: string;
}

@Component({
  selector: 'overckd-portion-quantifier-input',
  templateUrl: './portion-quantifier-input.component.html',
  styleUrls: ['./portion-quantifier-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PortionQuantifierInputComponent),
      multi: true,
    },
  ],
})
export class PortionQuantifierInputComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  public form = new FormGroup({
    kind: new FormControl(PortionKind.Label),
    quantity: new FormControl<number | null>(null),
    label: new FormControl(''),
  });

  public get kind() {
    return this.form.value.kind;
  }
  constructor(private portionQuantifierService: PortionQuantifierService) {}
  private kindsSubject = new BehaviorSubject<PortionKind[]>(
    this.portionQuantifierService.getAllKinds(),
  );

  public kinds$ = this.kindsSubject.asObservable();
  public PortionKind = PortionKind;

  private destroyed$ = new ReplaySubject<boolean>(1);

  private _onChange: (v: unknown) => void = () => {};
  private _onTouched: () => void = () => {};

  writeValue(obj: any): void {
    if (obj) {
      this.form.setValue(obj);
    }
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  ngOnInit(): void {
    this.form.controls
      .quantity!.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(quantity => {
        const kind =
          quantity === null ? PortionKind.Label : PortionKind.Quantity;

        this.form.patchValue({ kind });
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
