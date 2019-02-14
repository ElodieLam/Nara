import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AppComponent} from './app.component';
import {LayoutModule} from '@angular/cdk/layout';
import { CalendarModule, DateAdapter } from 'angular-calendar';
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
  MAT_DATE_LOCALE,
  MatSnackBarModule,
  MatDialogModule,
  MatSelectModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
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
import { LignedefraisComponent, LignedefraisAjoutComponent } from './lignedefrais/lignedefrais.component';
import { DialogEnvoyerAvance } from './lignedefrais/dialog-envoyer-avance.component'
import { DialogModifierAvance } from './lignedefrais/dialog-modifier-avance.component'
import { DialogModifierLignedefrais } from './lignedefrais/dialog-modifier-lignedefrais.component'
import { DialogNouvelleLignedefrais } from './lignedefrais/dialog-nouvelle-lignedefrais.component'
import { DialogEnvoyerLignes } from './lignedefrais/dialog-envoyer-lignes.component'
import { CongeComponent } from './conge/conge.component';

import { NotifComponent } from './notif/notif.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from "./login/login.service";
import { DemandecongeComponent } from './demandeconge/demandeconge.component';
import { NotedefraisresumeComponent } from './notedefraisresume/notedefraisresume.component';
import { HistoriquecongeComponent } from './historiqueconge/historiqueconge.component';
import { CreateDemandecongeComponent, DemandeRefuseeComponent } from './create-demandeconge/create-demandeconge.component';

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
    DialogModifierLignedefrais,
    DialogModifierAvance,
    DialogEnvoyerAvance,
    DialogEnvoyerLignes,
    LignedefraisAjoutComponent,
    CongeComponent,
    DemandecongeComponent,

    NotifComponent,
    LoginComponent,
    NotedefraisresumeComponent,
    HistoriquecongeComponent,
    CreateDemandecongeComponent,
    DemandeRefuseeComponent
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
    MatSnackBarModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  entryComponents: [
    DemandeRefuseeComponent,
    DialogNouvelleLignedefrais,
    DialogModifierLignedefrais,
    DialogModifierAvance,
    DialogEnvoyerAvance,
    DialogEnvoyerLignes,
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
