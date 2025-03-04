import { ChangeDetectionStrategy, Component, input } from '@angular/core';

interface RxTouchbarButtonOptions {
  label: string;
}

@Component({
  selector: 'ckad-desktop-touchbar-button',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopTouchbarButtonComponent {
  readonly name = input.required<string>();
  readonly label = input.required<string>();
}
