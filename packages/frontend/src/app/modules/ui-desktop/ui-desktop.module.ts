import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { WindowModule } from './window/window.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, WindowModule],
  exports: [WindowModule],
})
export class UiDesktopModule {}
