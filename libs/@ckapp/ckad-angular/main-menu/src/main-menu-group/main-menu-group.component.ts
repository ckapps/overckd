import { Component, input } from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'ckad-main-menu-group',
  templateUrl: './main-menu-group.component.html',
  styleUrls: ['./main-menu-group.component.scss'],
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    FontAwesomeModule,
  ],
})
export class CkadMainMenuGroupComponent {
  readonly groupName = input.required<string>();
  readonly icon = input.required<IconProp>();

  panelOpenState = true;
}
