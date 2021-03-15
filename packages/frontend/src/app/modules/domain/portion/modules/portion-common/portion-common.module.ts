import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//
import { PortionConverterComponent } from './components/portion-converter/portion-converter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PortionConverterComponent],
  exports: [PortionConverterComponent],
  imports: [CommonModule, FormsModule],
})
export class PortionCommonModule {}
