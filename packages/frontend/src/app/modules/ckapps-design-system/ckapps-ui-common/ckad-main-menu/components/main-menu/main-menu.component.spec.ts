import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkadMainMenuComponent } from './main-menu.component';

describe('CkadMainMenuComponent', () => {
  let component: CkadMainMenuComponent;
  let fixture: ComponentFixture<CkadMainMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CkadMainMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
