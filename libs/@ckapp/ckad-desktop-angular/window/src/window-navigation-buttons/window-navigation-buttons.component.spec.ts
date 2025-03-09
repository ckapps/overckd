import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CkadDesktopWindowNavigationButtons } from './window-navigation-buttons.component';

describe('CkadDesktopWindowNavigationButtons', () => {
  let component: CkadDesktopWindowNavigationButtons;
  let fixture: ComponentFixture<CkadDesktopWindowNavigationButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadDesktopWindowNavigationButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
