import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopTouchbarButtonComponent } from './desktop-touchbar-button.component';

describe('DesktopTouchbarButtonComponent', () => {
  let component: DesktopTouchbarButtonComponent;
  let fixture: ComponentFixture<DesktopTouchbarButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesktopTouchbarButtonComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopTouchbarButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
