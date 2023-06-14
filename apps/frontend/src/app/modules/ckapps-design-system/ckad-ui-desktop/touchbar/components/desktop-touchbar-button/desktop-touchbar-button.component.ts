import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface RxTouchbarButtonOptions {
  label: string;
}

@Component({
  selector: 'ckad-desktop-touchbar-button',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopTouchbarButtonComponent {
  @Input() name!: string;
  @Input() label!: string;
}
