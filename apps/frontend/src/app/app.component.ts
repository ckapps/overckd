import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationShell } from '../environments/application-shell.enum';
import { environment } from '../environments/environment';
import { AppMainMenuComponent } from './components/app-main-menu/app-main-menu.component';
import { UiDesktopModule } from './modules/ui-desktop/ui-desktop.module';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, UiDesktopModule, AppMainMenuComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  public shell: ApplicationShell = environment.shell;
}
