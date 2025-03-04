import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CkadUiCommonModule } from '../ckapps-design-system/ckad-ui-common/ckad-ui-common.module';
import { PageComponent } from './components/page/page.component';
import { IconsModule } from './icons/icons.module';

@NgModule({
  imports: [CommonModule, IconsModule, CkadUiCommonModule, PageComponent],
  exports: [IconsModule, CkadUiCommonModule, PageComponent],
})
export class UiModule {}
