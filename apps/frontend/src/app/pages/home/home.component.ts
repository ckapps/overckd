import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styles: [
    `
      h1 {
        @apply font-['Snell_Roundhand'];
        text-shadow: 0px -2px 3px #000;
      }
    `,
  ],
  host: {
    class: 'w-full h-full grid place-items-center',
  },
})
export class HomePageComponent {}
