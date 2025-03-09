import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverckdCommonPage } from '@overckd/ui/common/angular';
import { IconsModule } from './icons/icons.module';

@NgModule({
  imports: [CommonModule, IconsModule, OverckdCommonPage],
  exports: [IconsModule, OverckdCommonPage],
})
export class UiModule {}
