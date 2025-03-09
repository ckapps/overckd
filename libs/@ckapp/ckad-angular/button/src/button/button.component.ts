import { Component, HostBinding, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { CkadButtonBase } from '../button-base.type';

@Component({
  selector: 'ckad-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [MatButton],
})
export class CkadButtonComponent implements CkadButtonBase {
  @HostBinding('class.ckad-button') cssBaseClass = 'ckad-button';

  readonly color = input<ThemePalette>();

  readonly disabled = input(false);

  // @HostBinding('ngClass')
  // get classes() {
  //   return [this.color && `${this.cssBaseClass}--color-${this.color}`];
  // }
}
