import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'ckad-main-menu-group',
  templateUrl: './main-menu-group.component.html',
  styleUrls: ['./main-menu-group.component.scss'],
})
export class CkadMainMenuGroupComponent implements OnInit {
  @Input() groupName: string;
  @Input() icon: IconDefinition;

  constructor() {}

  ngOnInit(): void {}
}
