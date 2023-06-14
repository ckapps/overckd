import { Component, HostBinding, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { CkadButtonBase } from '../../button-base.type';

@Component({
  selector: 'ckad-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class CkadButtonButtonComponent implements CkadButtonBase {
  @HostBinding('class.ckad-button') cssBaseClass = 'ckad-button';

  @Input() color: ThemePalette;

  @Input() disabled = false;

  // @HostBinding('ngClass')
  // get classes() {
  //   return [this.color && `${this.cssBaseClass}--color-${this.color}`];
  // }
}
