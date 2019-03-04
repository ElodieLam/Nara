import { Component, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { NotifService } from '../notif/notif.service';
import { INotifService, INotifServiceDisplay} from '../notif/notif.interface';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-notif-service',
  templateUrl: './notif-service.component.html',
  styleUrls: ['./notif-service.component.css']
})
export class Notif_ServiceComponent{

  

  private sub : any;
  displayedColumns = ['date_heure', 'collaborateur', 'notif'];
  dataSource; //= new MatTableDataSource(this.ELEMENT_DATA);
  lNotifService : INotifService[] = [];
  lNotifDisplay: INotifServiceDisplay[];
  mois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  mobileVersion:boolean = false;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private notifService: NotifService, private login: LoginComponent) {
    this.mobileVersion = this.login.mobileVersion 
    }

  ngOnInit() {
    this.lNotifDisplay = [];  
    //Récupération des notifs "Demande de congé"
    this.notifService
    .getNotifFromIdCollabAndIdService({
      id_cds : this.login.user.id_collab, id_service : this.login.user.id_service
    })
    .subscribe( (data : INotifService[]) => {
      this.lNotifService = data;
      if(this.lNotifService.length > 0) {
        this.lNotifService.forEach( element => {
          if(element.ndfforcds == true) {
            this.lNotifDisplay.push({ 
              'ndfforcds' : element.ndfforcds,
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
            /*this.lNotifDisplay.push(
            { 
              'ndf' : false,
              'id' : element.id_dem,
              'date_notif' : new Date(),
              'date' : element.dateD.substring(0, 10) + " au " + element.dateF.substring(0, 10),
              'type' : element.dem ? "Demande de congé" : "Modification de congé", 
              'statut' : "Statut: " + this.transformStatus(element.statut),
              'color': 'cyan', 
              })*/
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
}