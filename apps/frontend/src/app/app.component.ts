import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationShell } from '../environments/application-shell.enum';
import { environment } from '../environments/environment';
import { AppMainMenuComponent } from './components/app-main-menu/app-main-menu.component';
import { CkadUiDesktopModule } from './modules/ckapps-design-system/ckad-ui-desktop/ckad-ui-desktop.module';

@Component({
  imports: [RouterModule, CkadUiDesktopModule, AppMainMenuComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  public shell: ApplicationShell = environment.shell;
}
