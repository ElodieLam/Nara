import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AppComponent} from './app.component';
import {LayoutModule} from '@angular/cdk/layout';
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
import { ToastrModule } from "ngx-toastr";
import { LignedefraisComponent } from './lignedefrais/lignedefrais.component';

const appRoutes: Routes = [
  {path: 'notedefrais', component: NotedefraisComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NotedefraisComponent,
    LignedefraisComponent,
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
  ],
  providers: [
    NotedefraisService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
