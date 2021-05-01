import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BusStopComponent } from './bus-stop/bus-stop.component';
import { RoutesComponent } from './routes/routes.component';
import { TimetableComponent } from './timetable/timetable.component';
import { HelpComponent } from './help/help.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './footer/footer.component';
import { ResetComponent } from './reset/reset.component';

@NgModule({
  declarations: [
    AppComponent,
    BusStopComponent,
    RoutesComponent,
    TimetableComponent,
    HelpComponent,
    FooterComponent,
    ResetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
