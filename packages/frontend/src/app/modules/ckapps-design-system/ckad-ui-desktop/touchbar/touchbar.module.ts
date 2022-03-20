import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopTouchbarComponent } from './components/desktop-touchbar/desktop-touchbar.component';
import { DesktopTouchbarButtonComponent } from './components/desktop-touchbar-button/desktop-touchbar-button.component';

@NgModule({
  declarations: [DesktopTouchbarComponent, DesktopTouchbarButtonComponent],
  imports: [CommonModule],
  exports: [DesktopTouchbarComponent, DesktopTouchbarButtonComponent],
})
export class TouchbarModule {}
