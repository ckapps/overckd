import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
})
export class AddRecipePageComponent implements OnInit {
  public recipeBaseForm: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.recipeBaseForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      portionQuantifier: this.fb.control(''),
      basedOn: this.fb.control([]),
    });
  }
}
