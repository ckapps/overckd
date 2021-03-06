import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CkadButtonDirective } from './directives/ckad-button.directive';

/**
 * Module that exposes buttons
 */
@NgModule({
  declarations: [CkadButtonDirective],
  exports: [CkadButtonDirective],
  imports: [CommonModule],
})
export class CkadButtonModule {}
