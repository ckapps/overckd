import { TestBed } from '@angular/core/testing';

import { IpcRendererService } from './ipc-renderer.service';

describe('IpcRendererService', () => {
  let service: IpcRendererService;

  beforeEach(() => {
    TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } });
    service = TestBed.inject(IpcRendererService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
