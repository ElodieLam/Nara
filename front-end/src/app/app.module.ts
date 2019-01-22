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
import { DemandecongeComponent } from './demandeconge/demandeconge.component';

const appRoutes: Routes = [
  {path: 'notedefrais', component: NotedefraisComponent},
  {path: 'conge', component: CongeComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NotedefraisComponent,
    LignedefraisComponent,
    CongeComponent,
    DemandecongeComponent,
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
