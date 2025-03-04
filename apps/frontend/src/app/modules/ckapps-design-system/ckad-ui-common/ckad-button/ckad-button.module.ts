import { NgModule } from '@angular/core';
import { CkadButtonRaisedComponent } from './components/button-raised/button-raised.component';
import { CkadButtonButtonComponent } from './components/button/button.component';

/**
 * Module that exposes buttons
 */
@NgModule({
  exports: [CkadButtonButtonComponent, CkadButtonRaisedComponent],
  imports: [CkadButtonButtonComponent, CkadButtonRaisedComponent],
})
export class CkadButtonModule {}
