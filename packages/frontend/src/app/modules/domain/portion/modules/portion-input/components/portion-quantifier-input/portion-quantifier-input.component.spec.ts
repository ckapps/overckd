import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
      ],
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
