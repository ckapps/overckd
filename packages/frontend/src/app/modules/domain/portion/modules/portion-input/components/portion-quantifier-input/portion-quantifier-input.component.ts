import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  PortionKind,
  PortionQuantifier,
} from '@overckd/domain/dist/models/portion-quantifier/portion-quantifier.model';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { PortionQuantifierService } from '../../../portion-common/services/portion-quantifier.service';

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
  implements OnInit, OnDestroy, ControlValueAccessor {
  public get kind() {
    return this.form.value.kind;
  }
  constructor(
    private fb: FormBuilder,
    private portionQuantifierService: PortionQuantifierService,
  ) {
    this.form = this.fb.group({
      kind: this.fb.control(PortionKind.Label),
      quantity: this.fb.control(null),
      label: this.fb.control(''),
    });
  }
  private kindsSubject = new BehaviorSubject<PortionKind[]>(
    this.portionQuantifierService.getAllKinds(),
  );

  public kinds$ = this.kindsSubject.asObservable();
  public PortionKind = PortionKind;

  public form: FormGroup;

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
    this.form
      .get('quantity')
      .valueChanges.pipe(takeUntil(this.destroyed$))
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
