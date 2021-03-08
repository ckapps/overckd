import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementNotesComponent } from './improvement-notes.component';

describe('ImprovementNotesComponent', () => {
  let component: ImprovementNotesComponent;
  let fixture: ComponentFixture<ImprovementNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImprovementNotesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
