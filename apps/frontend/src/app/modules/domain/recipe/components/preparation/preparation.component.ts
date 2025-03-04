import { Component, OnInit, input } from '@angular/core';
import { Recipe } from '@overckd/domain';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PreparationStepComponent } from '../preparation-step/preparation-step.component';

interface PreparationGroup {
  label?: string;
  steps: Recipe['steps'];
  stepsEnumerated?: Recipe['stepsEnumerated'];
  start?: number;
}

/**
 * Component for displaying recipe preparation steps
 */
@Component({
  selector: 'overckd-preparation',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss'],
  imports: [PreparationStepComponent, AsyncPipe],
})
export class PreparationComponent implements OnInit {
  readonly recipe = input.required<Recipe>();

  private recipe$!: BehaviorSubject<Recipe>;
  public preparationGroups$!: Observable<PreparationGroup[]>;

  ngOnInit() {
    this.recipe$ = new BehaviorSubject<Recipe>(this.recipe());

    this.preparationGroups$ = this.recipe$
      .asObservable()
      .pipe(map(recipe => this.getPreparationGroups(recipe)));
  }

  public isArray(obj: any) {
    return Array.isArray(obj);
  }

  private getPreparationGroups(recipe: Recipe): PreparationGroup[] {
    const { groups } = recipe;

    if (!groups || groups.length === 0) {
      return [
        {
          steps: recipe.steps,
          stepsEnumerated: recipe.stepsEnumerated,
        },
      ];
    }

    let start = 1;
    const stepsFromGroups = groups.map<PreparationGroup>(
      ({ label, steps, stepsEnumerated }) => {
        const group = {
          start,
          label,
          steps,
          stepsEnumerated,
        };

        start += steps.length;

        return group;
      },
    );

    return [
      ...stepsFromGroups,
      {
        label: 'Weitere Zubereitung',
        start,
        steps: recipe.steps,
        stepsEnumerated: recipe.stepsEnumerated,
      },
    ];
  }
}
