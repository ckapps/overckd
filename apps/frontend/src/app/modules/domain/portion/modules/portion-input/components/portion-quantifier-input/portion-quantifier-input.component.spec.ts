import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PortionKindPipe } from '../../../portion-common/pipes/portion-kind.pipe';

import { PortionQuantifierInputComponent } from './portion-quantifier-input.component';

describe('PortionQuantifierInputComponent', () => {
  let component: PortionQuantifierInputComponent;
  let fixture: ComponentFixture<PortionQuantifierInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PortionQuantifierInputComponent,
        // External declarations
        PortionKindPipe,
      ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortionQuantifierInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
