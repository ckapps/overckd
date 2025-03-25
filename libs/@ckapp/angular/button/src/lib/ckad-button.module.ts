import { NgModule } from '@angular/core';
import { CkadButtonRaisedComponent } from './button-raised.component';
import { CkadButtonButtonComponent } from './button.component';

/**
 * Module that exposes buttons
 */
@NgModule({
  exports: [CkadButtonButtonComponent, CkadButtonRaisedComponent],
  imports: [CkadButtonButtonComponent, CkadButtonRaisedComponent],
})
export class CkadButtonModule {}
