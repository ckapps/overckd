import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
})
export class AddRecipePageComponent implements OnInit {
  public recipeForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.recipeForm = this.fb.group({
      title: this.fb.control('', [Validators.required]),
    });
  }
}
