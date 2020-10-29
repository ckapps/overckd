import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeTipsComponent } from './recipe-tips.component';

describe('RecipeTipsComponent', () => {
  let component: RecipeTipsComponent;
  let fixture: ComponentFixture<RecipeTipsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RecipeTipsComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
