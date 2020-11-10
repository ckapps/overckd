import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { IconsModule } from './icons/icons.module';
import { MainMenuModule } from './main-menu/main-menu.module';
import { PageComponent } from './components/page/page.component';

@NgModule({
  declarations: [PageComponent],
  imports: [CommonModule, IconsModule, MainMenuModule],
  exports: [IconsModule, MainMenuModule, PageComponent],
})
export class UiModule {}
