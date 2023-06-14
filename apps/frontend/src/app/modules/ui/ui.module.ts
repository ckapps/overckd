import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// External modules
import { CkadUiCommonModule } from '../ckapps-design-system/ckad-ui-common/ckad-ui-common.module';

// Submodules
import { IconsModule } from './icons/icons.module';
import { PageComponent } from './components/page/page.component';

@NgModule({
  declarations: [PageComponent],
  imports: [CommonModule, IconsModule, CkadUiCommonModule],
  exports: [IconsModule, CkadUiCommonModule, PageComponent],
})
export class UiModule {}
