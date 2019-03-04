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
  MatFormFieldModule,
  MatSelectModule,
  MatTableModule,
  MatTabsModule,
  MatPaginatorModule,
  MatSortModule,
  MatGridListModule,
  MatCheckboxModule,
  MatCardModule,
  MatExpansionModule,
  MatMenuModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatDividerModule,
  MatInputModule,
  MAT_DATE_LOCALE,
  MatSnackBarModule,
  MatDialogModule,
  MatSelectModule,
  MatNativeDateModule,
  MatFormField,
  MatProgressSpinnerModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotedefraisComponent } from './notedefrais/notedefrais.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { NotedefraisService } from "./notedefrais/notedefrais.service";
import {MissionService} from "./missions/missions.service";
import { LignedefraisService } from "./lignedefrais/lignedefrais.service";
import { CongeService } from "./conge/conge.service";
import { ToastrModule } from "ngx-toastr";
import { LignedefraisComponent, SnackBarComponent } from './lignedefrais/lignedefrais.component';
import { DialogEnvoyerAvance } from './lignedefrais/dialog-envoyer-avance.component';
import { DialogModifierAvance } from './lignedefrais/dialog-modifier-avance.component';
import { DialogModifierLignedefrais } from './lignedefrais/dialog-modifier-lignedefrais.component';
import { DialogNouvelleLignedefrais } from './lignedefrais/dialog-nouvelle-lignedefrais.component';
import { DialogNouvelleAvance } from './lignedefrais/dialog-nouvelle-avance.component';
import { DialogEnvoyerLignes } from './lignedefrais/dialog-envoyer-lignes.component';
import { DialogInformation } from './lignedefrais/dialog-information.component';
import { CongeComponent } from './conge/conge.component';

import { NotifComponent } from './notif/notif.component';
import { Notif_ServiceComponent } from './notif-service/notif-service.component';
import { NotifMsgComponent } from './notif-msg/notif-msg.component';
import { NotifService } from './notif/notif.service';
import { LoginComponent } from './login/login.component';
import { LoginService } from "./login/login.service";
import { DemandecongeComponent } from './demandeconge/demandeconge.component';
import { NotedefraisresumeComponent } from './notedefraisresume/notedefraisresume.component';
import { HistoriquecongeComponent } from './historiqueconge/historiqueconge.component';

import { MissionsComponent} from './missions/missions.component';
import { DialogCreerMission } from './missions/dialog-creer-mission.component';
import { CreateDemandecongeComponent, DemandeRefuseeComponent } from './create-demandeconge/create-demandeconge.component';
import { GestionnotedefraisComponent } from './gestionnotedefrais/gestionnotedefrais.component';
import { GestionnotedefraisService } from './gestionnotedefrais/gestionnotedefrais.service';
import { GestionlignedefraisComponent } from './gestionlignedefrais/gestionlignedefrais.component';
import { DialogRefuserLigne } from './gestionlignedefrais/dialog-refuser-ligne.component';
import { ServicecomptaComponent } from './servicecompta/servicecompta.component';
import { ServicecomptaService } from './servicecompta/servicecompta.service';
import { ServicecomptandfComponent } from './servicecomptandf/servicecomptandf.component';
import { DialogRefuserLigneCompta } from './servicecomptandf/dialog-refuser-ligne.component';
import { NotifMsgServiceComponent } from './notif-msg-service/notif-msg-service.component';
import { LignedefraisavanceComponent } from './lignedefraisavance/lignedefraisavance.component';
import { GestionavanceComponent } from './gestionavance/gestionavance.component';
import { ServicecomptaavanceComponent } from './servicecomptaavance/servicecomptaavance.component';
import { DialogAccepterAvanceCompta } from './servicecomptandf/dialog-accepter-avance.component';
import { NotedefraishistoriqueComponent } from './notedefraishistorique/notedefraishistorique.component'
 

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'notedefrais', component: NotedefraisComponent},
    {path: 'notedefraishistorique', component: NotedefraishistoriqueComponent},
    {path: 'gestionnotedefrais', component: GestionnotedefraisComponent},
    {path: 'gestionnotedefrais/:id', component: GestionlignedefraisComponent},
    {path: 'servicecompta', component: ServicecomptaComponent},
    {path: 'servicecompta/:id', component: ServicecomptandfComponent},
    {path: 'conge', component: CongeComponent},
    {path: 'notifications', component: NotifComponent},
    {path: 'missions', component: MissionsComponent},
    {path: 'notifications/service', component: Notif_ServiceComponent},
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
    DialogNouvelleAvance,
    DialogModifierLignedefrais,
    DialogModifierAvance,
    DialogEnvoyerAvance,
    DialogEnvoyerLignes,
    DialogRefuserLigne,
    DialogRefuserLigneCompta,
    DialogAccepterAvanceCompta,
    DialogInformation,
    SnackBarComponent,
    CongeComponent,
    DemandecongeComponent,

    Notif_ServiceComponent,
    LoginComponent,
    DialogCreerMission,
    MissionsComponent,
    NotedefraisresumeComponent,
    HistoriquecongeComponent,
    CreateDemandecongeComponent,
    NotifMsgComponent,
    NotifComponent,
    DemandeRefuseeComponent,
    GestionnotedefraisComponent,
    GestionlignedefraisComponent,
    ServicecomptaComponent,
    ServicecomptandfComponent,
    NotifMsgServiceComponent,
    LignedefraisavanceComponent,
    GestionavanceComponent,
    ServicecomptaavanceComponent,
    NotedefraishistoriqueComponent,
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatGridListModule,
    MatExpansionModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
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
    DialogCreerMission,
    DemandeRefuseeComponent,
    DialogNouvelleLignedefrais,
    DialogNouvelleAvance,
    DialogModifierLignedefrais,
    DialogModifierAvance,
    DialogEnvoyerAvance,
    DialogEnvoyerLignes,
    DialogRefuserLigne,
    DialogRefuserLigneCompta,
    DialogAccepterAvanceCompta,
    DialogInformation,
    SnackBarComponent
  ],
  providers: [
    MissionService,
    NotedefraisService,
    LignedefraisService,
    ServicecomptaService,
    CongeService,
    LoginService,
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    NotifService,
    GestionnotedefraisService,
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}