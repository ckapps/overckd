import { TestBed } from '@angular/core/testing';

import { PortionConverterService } from './portion-converter.service';

describe('PortionConverterService', () => {
  let service: PortionConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } });
    service = TestBed.inject(PortionConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
