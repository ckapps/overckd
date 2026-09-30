import { NgModule } from '@angular/core';
import { PortionQuantifierInputComponent } from './components/portion-quantifier-input/portion-quantifier-input.component';

const COMPONENTS = [PortionQuantifierInputComponent];

@NgModule({
  exports: COMPONENTS,
  imports: [COMPONENTS],
})
export class PortionInputModule {}
