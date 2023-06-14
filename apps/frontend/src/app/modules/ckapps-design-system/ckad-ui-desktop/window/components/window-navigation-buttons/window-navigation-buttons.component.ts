import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ckad-desktop-window-navigation-buttons',
  templateUrl: './window-navigation-buttons.component.html',
  styleUrls: ['./window-navigation-buttons.component.scss'],
})
export class WindowNavigationButtonsComponent {
  public faChevronLeft = faChevronLeft;
  public faChevronRight = faChevronRight;

  // TODO: Initialize with 0
  public forwardCount = new BehaviorSubject<number>(1);

  constructor(private locationService: Location) {}

  onNavigateBack() {
    this.locationService.back();
    // this.forwardCount.next(this.forwardCount.value + 1);
  }

  onNavigateForward() {
    this.locationService.forward();
    // this.forwardCount.next(this.forwardCount.value - 1);
  }
}
