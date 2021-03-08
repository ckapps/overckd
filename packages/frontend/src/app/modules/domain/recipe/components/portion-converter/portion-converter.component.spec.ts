import { ComponentFixture, TestBed } from '@angular/core/testing';
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
      providers: [
        {
          provide: PortionConverterService,
          useValue: mockPortionConverterService,
        },
      ],
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
