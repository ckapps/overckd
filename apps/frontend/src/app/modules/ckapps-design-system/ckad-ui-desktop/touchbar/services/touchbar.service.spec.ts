import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ChannelService } from '../../messaging';
import { TouchbarService } from './touchbar.service';

describe('TouchbarService', () => {
  let spectator: SpectatorService<TouchbarService>;
  const createService = createServiceFactory({
    service: TouchbarService,
    mocks: [ChannelService],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });
});
