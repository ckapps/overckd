import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortionConverterComponent } from './components/portion-converter/portion-converter.component';
import { PortionKindPipe } from './pipes/portion-kind.pipe';

@NgModule({
  exports: [PortionConverterComponent, PortionKindPipe],
  imports: [
    CommonModule,
    FormsModule,
    PortionConverterComponent,
    PortionKindPipe,
  ],
})
export class PortionCommonModule {}
