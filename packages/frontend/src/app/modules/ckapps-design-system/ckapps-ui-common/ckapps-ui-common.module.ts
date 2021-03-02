import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { CkappsUiButtonModule } from './button/button.module';
import { MainMenuModule } from './main-menu/main-menu.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, CkappsUiButtonModule, MainMenuModule],
  exports: [CkappsUiButtonModule, MainMenuModule],
})
export class CkappsUiCommonModule {}
