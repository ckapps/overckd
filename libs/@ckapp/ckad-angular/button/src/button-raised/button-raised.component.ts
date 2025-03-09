import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { CkadButtonBase } from '../button-base.type';

@Component({
  selector: 'ckad-button-raised',
  templateUrl: './button-raised.component.html',
  styleUrls: ['./button-raised.component.scss'],
  imports: [MatButton],
})
export class CkadButtonRaisedComponent implements CkadButtonBase {
  readonly color = input<ThemePalette>();

  readonly disabled = input(false);
}
