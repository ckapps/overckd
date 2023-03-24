import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CkadInputFieldComponent } from './input-field.component';

describe('CkadInputFieldComponent', () => {
  let component: CkadInputFieldComponent;
  let fixture: ComponentFixture<CkadInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [CkadInputFieldComponent],
    imports: [
        NoopAnimationsModule,
        // Forms modules
        FormsModule,
        ReactiveFormsModule,
        // Material modules
        MatButtonModule,
        MatInputModule,
        MatIconModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
