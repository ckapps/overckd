import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MessagingModule } from './messaging/messaging.module';
import { TouchbarModule } from './touchbar/touchbar.module';
import { WindowModule } from './window/window.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, WindowModule, TouchbarModule, MessagingModule],
  exports: [WindowModule],
})
export class CkadUiDesktopModule {}
