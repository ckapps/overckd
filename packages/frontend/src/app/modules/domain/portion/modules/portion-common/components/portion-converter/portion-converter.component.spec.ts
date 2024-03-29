import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortionKind } from '@overckd/domain';
import { PortionConverterService } from '../../services/portion-converter.service';

import { PortionConverterComponent } from './portion-converter.component';

describe('PortionQuantifierComponent', () => {
  let component: PortionConverterComponent;
  let fixture: ComponentFixture<PortionConverterComponent>;

  const mockPortionConverterService = {
    getPortionQuantity: jest.fn(),
    calculateScalingFactorFromSource: jest.fn(),
  };

  let sourcePortion;

  beforeEach(() => {
    sourcePortion = {
      kind: PortionKind.Label,
      label: 'mock-label',
    };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortionConverterComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        {
          provide: PortionConverterService,
          useValue: mockPortionConverterService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortionConverterComponent);
    component = fixture.componentInstance;
    // Set props
    component.source = sourcePortion;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
