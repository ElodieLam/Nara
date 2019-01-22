import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AppComponent} from './app.component';
import {LayoutModule} from '@angular/cdk/layout';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotedefraisComponent } from './notedefrais/notedefrais.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { NotedefraisService } from "./notedefrais/notedefrais.service";
import {CongeService} from "./conge/conge.service";
import { ToastrModule } from "ngx-toastr";
import { LignedefraisComponent } from './lignedefrais/lignedefrais.component';
import { CongeComponent } from './conge/conge.component';
<<<<<<< HEAD

=======
import { NotifComponent } from './notif/notif.component';
import { LoginComponent } from './login/login.component';
>>>>>>> ca5cedcc05fc0bc8d36465aa1903148e313f6465

const appRoutes: Routes = [
    { path: '', redirectTo: 'notifications', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'notedefrais', component: NotedefraisComponent},
    {path: 'conge', component: CongeComponent},
    {path: 'notifications', component: NotifComponent}
  
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NotedefraisComponent,
    LignedefraisComponent,
    CongeComponent,
<<<<<<< HEAD

=======
    NotifComponent,
    LoginComponent,
>>>>>>> ca5cedcc05fc0bc8d36465aa1903148e313f6465
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  providers: [
    NotedefraisService,
    CongeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
