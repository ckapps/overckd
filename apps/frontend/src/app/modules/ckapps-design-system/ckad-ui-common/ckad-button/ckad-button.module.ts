import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

// Module components
import { CkadButtonRaisedComponent } from './components/button-raised/button-raised.component';
import { CkadButtonButtonComponent } from './components/button/button.component';

/**
 * Module that exposes buttons
 */
@NgModule({
  declarations: [CkadButtonButtonComponent, CkadButtonRaisedComponent],
  exports: [CkadButtonButtonComponent, CkadButtonRaisedComponent],
  imports: [CommonModule, MatButtonModule],
})
export class CkadButtonModule {}
