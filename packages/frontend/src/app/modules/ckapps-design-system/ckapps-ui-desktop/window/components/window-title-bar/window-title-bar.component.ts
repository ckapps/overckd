import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ckad-desktop-window-title-bar',
  templateUrl: './window-title-bar.component.html',
  styleUrls: ['./window-title-bar.component.scss'],
})
export class WindowTitleBarComponent implements OnInit {
  @Input() title: string;

  constructor() {}

  ngOnInit(): void {}
}
