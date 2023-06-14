import { Injectable } from '@angular/core';
import { ChannelService } from '../../messaging';
import { ChannelObserver } from '../../messaging/rxjs/channel-observer';

const CHANNEL = 'os.touchbar';

// interface TouchBar {}

@Injectable({
  providedIn: 'root',
})
export class TouchbarService {
  private channelObserver: ChannelObserver;

  // private touchbarSubject = new BehaviorSubject<TouchBar>(undefined);

  constructor(private channelService: ChannelService) {
    this.channelObserver = this.channelService.createChannel(CHANNEL);
  }

  // public setTouchBar(touchbar: TouchBar) {
  //   this.touchbarSubject.next(touchbar);
  // }

  public patchTouchBar(touchbar: Record<string, Partial<Record<string, any>>>) {
    this.channelObserver.emit(touchbar);
  }
}
