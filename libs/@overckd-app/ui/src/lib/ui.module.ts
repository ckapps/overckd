import { NgModule } from '@angular/core';
import { IconsModule } from './icons.module';
import { PageComponent } from './page/page.component';

@NgModule({
  imports: [IconsModule, PageComponent],
  exports: [IconsModule, PageComponent],
})
export class SharedUiModule {}
