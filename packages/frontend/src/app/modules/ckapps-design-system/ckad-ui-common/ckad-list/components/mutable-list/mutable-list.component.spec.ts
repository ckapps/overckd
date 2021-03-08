import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkadMutableListComponent } from './mutable-list.component';

@Component({
  selector: 'ckad-list',
  template: '',
})
export class MockCkadListComponent {}

describe('MutableListComponent', () => {
  let component: CkadMutableListComponent;
  let fixture: ComponentFixture<CkadMutableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CkadMutableListComponent,
        // Mocked
        MockCkadListComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadMutableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
