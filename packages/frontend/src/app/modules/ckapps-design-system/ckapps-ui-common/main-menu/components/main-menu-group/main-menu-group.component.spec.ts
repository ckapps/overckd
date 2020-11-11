import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMenuGroupComponent } from './main-menu-group.component';

describe('MainMenuGroupComponent', () => {
  let component: MainMenuGroupComponent;
  let fixture: ComponentFixture<MainMenuGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainMenuGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
