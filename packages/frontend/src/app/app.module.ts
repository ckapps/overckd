import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// Other modules needed
import { DomainModule } from './modules/domain/domain.module';
import { UiModule } from './modules/ui/ui.module';
import { UiDesktopModule } from './modules/ui-desktop/ui-desktop.module';

// Module stuff
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundPageComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [AppComponent, NotFoundPageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DomainModule,
    UiModule,
    UiDesktopModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
