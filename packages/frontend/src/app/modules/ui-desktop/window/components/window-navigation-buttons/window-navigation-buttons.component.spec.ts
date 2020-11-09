import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowNavigationButtonsComponent } from './window-navigation-buttons.component';

describe('WindowNavigationButtonsComponent', () => {
  let component: WindowNavigationButtonsComponent;
  let fixture: ComponentFixture<WindowNavigationButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindowNavigationButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowNavigationButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
