import { TestBed } from '@angular/core/testing';

import { TouchbarService } from './touchbar.service';

describe('TouchbarService', () => {
  let service: TouchbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TouchbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
