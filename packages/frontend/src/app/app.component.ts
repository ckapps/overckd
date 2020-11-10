import { Component } from '@angular/core';
import { faHome, faUtensils } from '@fortawesome/free-solid-svg-icons';

import { ApplicationShell } from 'src/environments/application-shell.enum';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  public shell: ApplicationShell = environment.shell;

  public faHome = faHome;
  public faUtensils = faUtensils;
}
