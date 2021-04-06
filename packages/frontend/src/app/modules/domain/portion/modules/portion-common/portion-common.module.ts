import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//
import { PortionConverterComponent } from './components/portion-converter/portion-converter.component';
import { FormsModule } from '@angular/forms';
import { PortionKindPipe } from './pipes/portion-kind.pipe';

@NgModule({
  declarations: [PortionConverterComponent, PortionKindPipe],
  exports: [PortionConverterComponent, PortionKindPipe],
  imports: [CommonModule, FormsModule],
})
export class PortionCommonModule {}
