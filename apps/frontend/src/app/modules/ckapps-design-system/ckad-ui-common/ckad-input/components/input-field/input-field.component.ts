import { Component, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as Fn from 'effect/Function';

/**
 * Component that represents an input field
 */
@Component({
  selector: 'ckad-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CkadInputFieldComponent),
      multi: true,
    },
  ],
})
export class CkadInputFieldComponent implements ControlValueAccessor {
  @HostBinding('class.ckad-input-field') readonly componentClass =
    'ckad-input-field';

  @Input() type!: string;
  /**
   * The placeholder
   */
  @Input() placeholder!: string;
  /**
   * Label for the input
   */
  @Input() label!: string;
  /**
   * Whether there is a clear button
   */
  @Input() clearable = true;

  private _value: any;

  public get value() {
    return this._value;
  }

  public set value(newValue: any) {
    this._value = newValue;
    this._onChange(this._value);
    this._onTouched();
  }

  private _onChange: (v: unknown) => void = Fn.constVoid;
  private _onTouched: () => void = Fn.constVoid;

  writeValue(obj: any): void {
    this._value = obj;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error('Method not implemented.');
  // }

  public css(...parts: string[]) {
    return [this.componentClass, ...parts].join();
  }
}
