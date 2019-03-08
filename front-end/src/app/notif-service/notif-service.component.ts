import { Component, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { NotifService } from '../notif/notif.service';
import { INotifService, INotifServiceDisplay} from '../notif/notif.interface';
import { LoginComponent } from '../login/login.component';
import { DatePipe } from '@angular/common';

/**
 * Responsable: E.LAM, A.Descottes
 * Component contenant la page des notifications d'un chef de service
 */

@Component({
  selector: 'app-notif-service',
  templateUrl: './notif-service.component.html',
  styleUrls: ['./notif-service.component.css'],
  providers: [DatePipe]
})
export class Notif_ServiceComponent{

  

  private sub : any;
  displayedColumns = ['date_heure', 'collaborateur', 'notif'];
  dataSource;
  lNotifService : INotifService[] = [];
  lNotifDisplay: INotifServiceDisplay[];
  mois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  mobileVersion:boolean = false;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private notifService: NotifService, private login: LoginComponent,
    private datePipe : DatePipe) {
    this.mobileVersion = this.login.mobileVersion 
    }

  ngOnInit() {
    this.lNotifDisplay = [];  
    //Récupération des notifs "Demande de congé"
    this.notifService
    .getNotifFromIdCollabAndIdService({
      id_cds : this.login.user.id_collab, id_service : this.login.user.id_service,
      isCds : this.login.user.isCDS 
    })
    .subscribe( (data : INotifService[]) => {
      this.lNotifService = data;
      if(this.lNotifService.length > 0) {
        this.lNotifService.forEach( element => {
          if(element.ndfforcds == true) {
            this.lNotifDisplay.push({ 
              'ndfforcds' : element.ndfforcds,
              'congeforcds' : null,
              'service' : "",
              'id' : element.id_ndf,
              'id_collab' : element.id_collab,
              'nom' : element.nom_collab,
              'prenom' : element.prenom_collab,
              'date_notif' : new Date(element.date.toString()),
              'date' : this.mois[+element.mois] + ' ' + element.annee,
              'type' : element.avance ? "Demande d'avance" : "Note de frais", 
              'statut' : "En attente du Chef de service",
              'color': 'orange', 
            })
          }
          else if(element.ndfforcds == false) {
            this.lNotifDisplay.push({ 
              'ndfforcds' : element.ndfforcds,
              'congeforcds' : null,
              'service' : element.nom_service,
              'id' : element.id_ndf,
              'id_collab' : element.id_collab,
              'nom' : element.nom_collab,
              'prenom' : element.prenom_collab,
              'date_notif' : new Date(element.date.toString()),
              'date' : this.mois[+element.mois] + ' ' + element.annee,
              'type' : element.avance ? "Demande d'avance" : "Note de frais", 
              'statut' : "En attente de la Comptabilité",
              'color': 'orange', 
            })
          }
          else if(element.ndfforcds == null) {
            if(element.congeforcds == true) {
              this.lNotifDisplay.push(
                { 
                  'ndfforcds' : null,
                  'congeforcds' : element.congeforcds,
                  'service' : element.nom_service,
                  'id' : element.id_dem,
                  'id_collab' : element.id_collab,
                  'nom' : element.nom_collab,
                  'prenom' : element.prenom_collab,
                  'date_notif' : new Date(element.date.toString()),
                  'date' : 'du' + this.transformDate(element.dateD) + " au " + this.transformDate(element.dateF),
                  'type' : "Demande de congé", 
                  'statut' : "En attente de du chef de service",
                  'color': 'cyan', 
                })
            }
            else if(element.congeforcds == false) {
              this.lNotifDisplay.push(
              { 
                'ndfforcds' : null,
                  'congeforcds' : element.congeforcds,
                  'service' : element.nom_service,
                  'id' : element.id_dem,
                  'id_collab' : element.id_collab,
                  'nom' : element.nom_collab,
                  'prenom' : element.prenom_collab,
                  'date_notif' : new Date(element.date.toString()),
                  'date' : 'du' + this.transformDate(element.dateD) + " au " + this.transformDate(element.dateF),
                  'type' : "Demande de congé", 
                  'statut' : "En attente du service RH",
                  'color': 'cyan', 
              })
            }
          }

              //Affiche les éléments dans le tableau
          });
        this.lNotifDisplay.sort((a, b) => {
          return a.date_notif < b.date_notif ? 1 : -1
        });
        this.dataSource = new MatTableDataSource <INotifServiceDisplay> (this.lNotifDisplay);
        this.dataSource.paginator = this.paginator;
  }
  })
  }

  listemois : string[] = ['null', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'décembre'];

  /**
   * Méthode transformant la date en date lisible pour l'affichage
   * @param date 
   */
  transformDate(date : String) : string {
    var str = this.datePipe.transform(new Date(date.toString()), 'yyyy-MM-dd').split("-",3);
    return str[2] + ' ' + this.listemois[+str[1]] + ' ' + str[0];
  }
}