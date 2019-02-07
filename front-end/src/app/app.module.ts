import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AppComponent} from './app.component';
import {LayoutModule} from '@angular/cdk/layout';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
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
  MatMenuModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatSelectModule,
  MatSnackBarModule,
  MatNativeDateModule,
  MatFormField,
  MatInputModule,
  MAT_DATE_LOCALE
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotedefraisComponent } from './notedefrais/notedefrais.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { NotedefraisService } from "./notedefrais/notedefrais.service";
import { LignedefraisService } from "./lignedefrais/lignedefrais.service";
import { CongeService } from "./conge/conge.service";
import { ToastrModule } from "ngx-toastr";
import { 
  LignedefraisComponent,
  DialogNouvelleLignedefrais,
  LignedefraisAjoutComponent 
} from './lignedefrais/lignedefrais.component';
import { CongeComponent } from './conge/conge.component';




import { NotifComponent } from './notif/notif.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from "./login/login.service";
import { DemandecongeComponent } from './demandeconge/demandeconge.component';
import { NotedefraisresumeComponent } from './notedefraisresume/notedefraisresume.component';
import { HistoriquecongeComponent } from './historiqueconge/historiqueconge.component';
import { CreateDemandecongeComponent } from './create-demandeconge/create-demandeconge.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'notedefrais', component: NotedefraisComponent},
    {path: 'conge', component: CongeComponent},
    {path: 'notifications', component: NotifComponent},
    {path: 'lignedefrais/:id', component: LignedefraisComponent},
    {path: 'historiqueconge', component: HistoriquecongeComponent},
    {path: 'create-demandeconge', component: CreateDemandecongeComponent}
  
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NotedefraisComponent,
    LignedefraisComponent,
    DialogNouvelleLignedefrais,
    LignedefraisAjoutComponent,
    CongeComponent,
    DemandecongeComponent,

    NotifComponent,
    LoginComponent,
    NotedefraisresumeComponent,
    HistoriquecongeComponent,
    CreateDemandecongeComponent,
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
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    [FormsModule, FlatpickrModule.forRoot()],
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  entryComponents: [ 
    DialogNouvelleLignedefrais,
    LignedefraisAjoutComponent
  ],
  providers: [
    NotedefraisService,
    LignedefraisService,
    CongeService,
    LoginService,
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
