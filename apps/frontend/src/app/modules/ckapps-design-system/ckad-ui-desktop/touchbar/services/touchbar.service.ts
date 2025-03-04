import { Injectable, inject } from '@angular/core';
import { ChannelService } from '../../messaging';

const CHANNEL = 'os.touchbar';

// interface TouchBar {}

@Injectable({
  providedIn: 'root',
})
export class TouchbarService {
  private readonly channelService = inject(ChannelService);

  private channelObserver = this.channelService.createChannel(CHANNEL);

  // private touchbarSubject = new BehaviorSubject<TouchBar>(undefined);

  // public setTouchBar(touchbar: TouchBar) {
  //   this.touchbarSubject.next(touchbar);
  // }

  public patchTouchBar(touchbar: Record<string, Partial<Record<string, any>>>) {
    this.channelObserver.emit(touchbar);
  }
}
