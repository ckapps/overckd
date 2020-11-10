import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, SubscriptionLike } from 'rxjs';

@Component({
  selector: 'ocui-window-navigation-buttons',
  templateUrl: './window-navigation-buttons.component.html',
  styleUrls: ['./window-navigation-buttons.component.scss'],
})
export class WindowNavigationButtonsComponent implements OnInit, OnDestroy {
  public faChevronLeft = faChevronLeft;
  public faChevronRight = faChevronRight;

  // private subscription: SubscriptionLike;
  // TODO: Initialize with 0
  public forwardCount = new BehaviorSubject<number>(1);

  constructor(private locationService: Location) {}

  ngOnInit(): void {
    // this.locationService.onUrlChange((url: string, state: unknown) => {
    //   console.log('Location changes to ' + url);
    //   console.log(state);
    // });
    // this.subscription = this.locationService.subscribe(x => {
    //   console.log('location event', x);
    // });
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  onNavigateBack() {
    this.locationService.back();
    // this.forwardCount.next(this.forwardCount.value + 1);
  }

  onNavigateForward() {
    this.locationService.forward();
    // this.forwardCount.next(this.forwardCount.value - 1);
  }
}
