import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ELECTRON_IPC_RENDERER } from '../electron-interop.tokens';
import { ChannelService } from './channel.service';

describe('ChannelService', () => {
  let spectator: SpectatorService<ChannelService>;
  const createService = createServiceFactory({
    service: ChannelService,
    providers: [{ provide: ELECTRON_IPC_RENDERER, useValue: {} }],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });
});
