import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

// Module components
import { CkadButtonButtonComponent } from './components/button/button.component';
import { CkadButtonRaisedComponent } from './components/button-raised/button-raised.component';

/**
 * Module that exposes buttons
 */
@NgModule({
  declarations: [CkadButtonButtonComponent, CkadButtonRaisedComponent],
  exports: [CkadButtonButtonComponent, CkadButtonRaisedComponent],
  imports: [CommonModule, MatButtonModule],
})
export class CkadButtonModule {}
