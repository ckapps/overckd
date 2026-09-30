import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CkadDesktopWindowModule } from '@ckapp/angular-desktop/window';
import { ApplicationShell } from '../environments/application-shell.enum';
import { environment } from '../environments/environment';
import { AppMainMenuComponent } from './components/app-main-menu/app-main-menu.component';

@Component({
  imports: [RouterModule, CkadDesktopWindowModule, AppMainMenuComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  public shell: ApplicationShell = environment.shell;
}
