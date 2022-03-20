import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

interface RxTouchbarButtonOptions {
  label: string;
}

@Component({
  selector: 'ckad-desktop-touchbar-button',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopTouchbarButtonComponent implements OnInit {
  @Input() name: string;
  @Input() label: string;
  constructor() {}

  ngOnInit(): void {}
}
