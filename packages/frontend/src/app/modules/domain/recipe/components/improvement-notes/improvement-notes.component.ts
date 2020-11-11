import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'overckd-improvement-notes',
  templateUrl: './improvement-notes.component.html',
  styleUrls: ['./improvement-notes.component.scss'],
})
export class ImprovementNotesComponent implements OnInit {
  @Input() numberOfLines: number;

  constructor() {}

  ngOnInit() {}

  public get items() {
    const result = [];

    for (let i = this.numberOfLines; i > 0; --i) {
      result.push(i);
    }

    return result;
  }
}
