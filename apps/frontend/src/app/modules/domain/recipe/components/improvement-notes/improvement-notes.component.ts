import { Component, input } from '@angular/core';

@Component({
  selector: 'overckd-improvement-notes',
  templateUrl: './improvement-notes.component.html',
  styleUrls: ['./improvement-notes.component.scss'],
  imports: [],
})
export class ImprovementNotesComponent {
  readonly numberOfLines = input.required<number>();

  public get items() {
    const result = [];

    for (let i = this.numberOfLines(); i > 0; --i) {
      result.push(i);
    }

    return result;
  }
}
