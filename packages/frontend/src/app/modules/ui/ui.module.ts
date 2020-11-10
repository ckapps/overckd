import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// External modules
import { CkappsUiCommonModule } from '../ckapps-design-system/ckapps-ui-common/ckapps-ui-common.module';

// Submodules
import { IconsModule } from './icons/icons.module';
import { PageComponent } from './components/page/page.component';

@NgModule({
  declarations: [PageComponent],
  imports: [CommonModule, IconsModule, CkappsUiCommonModule],
  exports: [IconsModule, CkappsUiCommonModule, PageComponent],
})
export class UiModule {}
