import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { IconsModule } from './icons/icons.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, IconsModule],
  exports: [IconsModule],
})
export class UiModule {}
