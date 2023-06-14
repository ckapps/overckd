import { Component, Input } from '@angular/core';

@Component({
  selector: 'overckd-improvement-notes',
  templateUrl: './improvement-notes.component.html',
  styleUrls: ['./improvement-notes.component.scss'],
})
export class ImprovementNotesComponent {
  @Input() numberOfLines!: number;

  public get items() {
    const result = [];

    for (let i = this.numberOfLines; i > 0; --i) {
      result.push(i);
    }

    return result;
  }
}
