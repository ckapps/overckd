import { Component, OnInit, Input } from '@angular/core';

import { Recipe } from '@overckd/domain';

@Component({
  selector: 'cb-recipe-tips',
  templateUrl: './recipe-tips.component.html',
  styleUrls: ['./recipe-tips.component.scss'],
})
export class RecipeTipsComponent implements OnInit {
  @Input() recipe: Recipe;
  constructor() {}

  ngOnInit() {}
}
