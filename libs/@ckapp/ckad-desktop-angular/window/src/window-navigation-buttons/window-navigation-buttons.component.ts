import { AsyncPipe, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ckad-desktop-window-navigation-buttons',
  templateUrl: './window-navigation-buttons.component.html',
  styleUrls: ['./window-navigation-buttons.component.scss'],
  imports: [FontAwesomeModule, AsyncPipe],
})
export class CkadDesktopWindowNavigationButtons {
  readonly #locationService = inject(Location);

  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;

  // TODO: Initialize with 0
  protected readonly forwardCount = new BehaviorSubject<number>(1);

  onNavigateBack() {
    this.#locationService.back();
    // this.forwardCount.next(this.forwardCount.value + 1);
  }

  onNavigateForward() {
    this.#locationService.forward();
    // this.forwardCount.next(this.forwardCount.value - 1);
  }
}
