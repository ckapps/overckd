import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { WindowModule } from './window/window.module';
import { TouchbarModule } from './touchbar/touchbar.module';
import { CkadDesktorCoreModule } from './core/core.module';
import { MessagingModule } from './messaging/messaging.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WindowModule,
    TouchbarModule,
    CkadDesktorCoreModule,
    MessagingModule,
  ],
  exports: [WindowModule],
})
export class CkadUiDesktopModule {}
