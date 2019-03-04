import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AppComponent} from './app.component';
import {LayoutModule} from '@angular/cdk/layout';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

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
  MatMenuModule,
  MatNativeDateModule,
  MatDialogModule,
  MatInputModule,
} from '@angular/material';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotedefraisComponent } from './notedefrais/notedefrais.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { NotedefraisService } from "./notedefrais/notedefrais.service";
import {CongeService} from "./conge/conge.service";
import {MissionService} from "./missions/missions.service";
import { ToastrModule } from "ngx-toastr";
import { LignedefraisComponent } from './lignedefrais/lignedefrais.component';
import { CongeComponent } from './conge/conge.component';

import { NotifComponent } from './notif/notif.component';
import { LoginComponent } from './login/login.component';
import { DemandecongeComponent } from './demandeconge/demandeconge.component';
import { HistoriquecongeComponent } from './historiqueconge/historiqueconge.component';
import { ChefdeserviceComponent } from './chefdeservice/chefdeservice.component';
import { MissionsComponent} from './missions/missions.component';
import { DialogCreerMission } from './missions/dialog-creer-mission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const appRoutes: Routes = [
    {path: '', redirectTo: 'notifications', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'notedefrais', component: NotedefraisComponent},
    {path: 'conge', component: CongeComponent},
    {path: 'notifications', component: NotifComponent},
    {path: 'historiqueconge', component: HistoriquecongeComponent},
    {path: 'chefdeservice', component: ChefdeserviceComponent},
    {path: 'missions', component: MissionsComponent}
  
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NotedefraisComponent,
    LignedefraisComponent,
    CongeComponent,
    DemandecongeComponent,

    NotifComponent,
    LoginComponent,
    DialogCreerMission,
    HistoriquecongeComponent,
    ChefdeserviceComponent,
    MissionsComponent
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
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatGridListModule,
    MatDatepickerModule,
    MatCardModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatNativeDateModule,
    MatDialogModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],

  entryComponents: [
    DialogCreerMission
  ],
  
  providers: [
    NotedefraisService,
    CongeService,
    MissionService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
