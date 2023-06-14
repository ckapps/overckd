import { TestBed } from '@angular/core/testing';

import { PortionQuantifierService } from './portion-quantifier.service';

describe('PortionQuantifierService', () => {
  let service: PortionQuantifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } });
    service = TestBed.inject(PortionQuantifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
