import { Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

import { CkadButtonBase } from '../../button-base.type';

@Component({
  selector: 'ckad-button-raised',
  templateUrl: './button-raised.component.html',
  styleUrls: ['./button-raised.component.scss'],
})
export class CkadButtonRaisedComponent implements CkadButtonBase {
  @Input() color: ThemePalette;

  @Input() disabled: boolean;
}
