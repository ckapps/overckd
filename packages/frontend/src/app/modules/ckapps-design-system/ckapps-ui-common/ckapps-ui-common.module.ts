import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { MainMenuModule } from './main-menu/main-menu.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, MainMenuModule],
  exports: [MainMenuModule],
})
export class CkappsUiCommonModule {}
