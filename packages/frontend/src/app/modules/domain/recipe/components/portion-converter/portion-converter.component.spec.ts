import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortionConverterComponent } from './portion-converter.component';

describe('PortionQuantifierComponent', () => {
  let component: PortionConverterComponent;
  let fixture: ComponentFixture<PortionConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortionConverterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortionConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
