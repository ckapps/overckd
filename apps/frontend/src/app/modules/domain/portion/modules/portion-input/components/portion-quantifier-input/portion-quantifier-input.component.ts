import { AsyncPipe } from '@angular/common';
import {
  Component,
  forwardRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { PortionKind } from '@overckd/domain';
import * as Fn from 'effect/Function';
import { BehaviorSubject, ReplaySubject, takeUntil } from 'rxjs';
import { PortionKindPipe } from '../../../portion-common/pipes/portion-kind.pipe';
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
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    AsyncPipe,
    PortionKindPipe,
  ],
})
export class PortionQuantifierInputComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  readonly #portionQuantifierService = inject(PortionQuantifierService);

  public form = new FormGroup({
    kind: new FormControl(PortionKind.Label),
    quantity: new FormControl<number | null>(null),
    label: new FormControl(''),
  });

  public get kind() {
    return this.form.value.kind;
  }
  private kindsSubject = new BehaviorSubject<PortionKind[]>(
    this.#portionQuantifierService.getAllKinds(),
  );

  public kinds$ = this.kindsSubject.asObservable();
  public PortionKind = PortionKind;

  private destroyed$ = new ReplaySubject<boolean>(1);

  private _onChange: (v: unknown) => void = Fn.constVoid;
  private _onTouched: () => void = Fn.constVoid;

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
