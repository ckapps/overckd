import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkadMainMenuGroupComponent } from './main-menu-group.component';

describe('MainMenuGroupComponent', () => {
  let component: CkadMainMenuGroupComponent;
  let fixture: ComponentFixture<CkadMainMenuGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CkadMainMenuGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadMainMenuGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
