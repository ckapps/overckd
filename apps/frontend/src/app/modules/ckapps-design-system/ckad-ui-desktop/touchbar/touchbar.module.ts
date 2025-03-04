import { NgModule } from '@angular/core';
import { DesktopTouchbarButtonComponent } from './components/desktop-touchbar-button/desktop-touchbar-button.component';
import { DesktopTouchbarComponent } from './components/desktop-touchbar/desktop-touchbar.component';

@NgModule({
  imports: [DesktopTouchbarComponent, DesktopTouchbarButtonComponent],
  exports: [DesktopTouchbarComponent, DesktopTouchbarButtonComponent],
})
export class TouchbarModule {}
