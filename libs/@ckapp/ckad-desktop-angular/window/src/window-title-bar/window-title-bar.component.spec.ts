import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CkadDesktopWindowTitleBar } from './window-title-bar.component';

describe('CkadDesktopWindowTitleBar', () => {
  let component: CkadDesktopWindowTitleBar;
  let fixture: ComponentFixture<CkadDesktopWindowTitleBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadDesktopWindowTitleBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
