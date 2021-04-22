import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopTouchbarComponent } from './desktop-touchbar.component';

describe('DesktopTouchbarComponent', () => {
  let component: DesktopTouchbarComponent;
  let fixture: ComponentFixture<DesktopTouchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesktopTouchbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopTouchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
