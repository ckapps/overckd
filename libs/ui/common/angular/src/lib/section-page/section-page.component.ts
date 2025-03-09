import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'overckd-common-section-page',
  template: '<router-outlet />',
  imports: [RouterOutlet],
  host: {
    class: 'overckd-page',
  },
})
export class OverckdCommonSectionPage {}
