import { Component, Input } from '@angular/core';

@Component({
  selector: 'ckad-desktop-window-title-bar',
  templateUrl: './window-title-bar.component.html',
  styleUrls: ['./window-title-bar.component.scss'],
})
export class WindowTitleBarComponent {
  @Input() title = '';
}
