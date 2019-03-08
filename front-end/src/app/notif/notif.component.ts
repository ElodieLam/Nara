import { Component, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { NotifService } from './notif.service';
import { INotifDisplay, INotif} from './notif.interface';
import { LoginComponent } from '../login/login.component';
import { DatePipe } from '@angular/common';

/**
 * Responsable: E.LAM, A.Descottes
 * Component contenant la page des notifications d'un collaborateur simple
 */
@Component({
  selector: 'app-notif',
  templateUrl: './notif.component.html',
  styleUrls: ['../notif-service/notif-service.component.css'],
  providers : [DatePipe]
})

/**
 * Cette classe récupère la liste des notifications correspondant au collaborateur puis crée un component pour chaque notification
 */
export class NotifComponent{

  private sub : any;
  displayedColumns = ['date_heure', 'notif'];
  dataSource;
  lNotifDisplay: INotifDisplay[];
  lNotif: INotif[] = [];
  mois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  values:boolean = true;
  mobileVersion: boolean = true;

  status : any[] = [
    {key: 'validee', value : 'Validée'},
    {key: 'refusee', value : 'Refusée'}
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private notifService: NotifService, private login: LoginComponent,
    private datePipe : DatePipe) { 
    this.mobileVersion = this.login.mobileVersion;
    }

  ngOnInit() {
    this.lNotifDisplay = [];  

    this.notifService
    .getNotifCollab({id : this.login.user.id_collab})
    .subscribe( (data : INotif[]) => {
      this.lNotif = data;
      if(this.lNotif.length > 0) {
        this.lNotif.forEach( element => {
          if(element.ndf) {
            this.lNotifDisplay.push({ 
              'ndf' : true,
              'id' : element.id_ndf,
              'date_notif' : new Date(element.date.toString()),
              'date' : this.mois[+element.mois] + ' ' + element.annee,
              'type' : element.avance ? "Demande d'avance" : "Note de frais", 
              'statut' : element.acceptee ? "Lignes validées" : "Lignes refusées",
              'color': 'orange', 
            })
          }
          else {
            this.lNotifDisplay.push(
            { 
              'ndf' : false,
              'id' : element.id_dem,
              'date_notif' : new Date(element.date.toString()),
              'date' : 'du' + this.transformDate(element.dateD) + " au " + this.transformDate(element.dateF),
              'type' : 'Demande de congé', 
              'statut' : "Statut : " + this.transformStatusConge(element.statut),
              'color': 'cyan', 
              })
          }
        });
        this.lNotifDisplay.sort((a, b) => {
          return a.date_notif < b.date_notif ? 1 : -1
        });
      }
      //Affiche les éléments dans le tableau
      this.dataSource = new MatTableDataSource <INotifDisplay> (this.lNotifDisplay);
      this.dataSource.paginator = this.paginator;
    })
  }

/**
 * Méthode permettant de transformer le statut de la demande en string pour l'afficher
 * @param status 
 */
  transformStatus(status : String) : String {
    for(var i = 0; i < this.status.length ; i ++){
      if(this.status[i].key == status)
        return this.status[i].value;
    }
    return 'statut undefined'
  }

  /**
 * Méthode permettant de transformer le statut de la demande de congé en string pour l'afficher
 * @param status 
 */
  transformStatusConge(statut : String) : String {
    if(statut == 'noCds')
      return 'refus Chef de service'
    else if(statut == 'noRh')
      return 'refus service RH'
    else if(statut == 'validee')
      return 'validée'
  }

  listemois : string[] = ['null', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'décembre'];

  /**
 * Méthode permettant de transformer la date de la notification en date lisible pour l'affichage
 * @param status 
 */
  transformDate(date : String) : string {

    var str = this.datePipe.transform(new Date(date.toString()), 'yyyy-MM-dd').split("-",3);
    return str[2] + ' ' + this.listemois[+str[1]] + ' ' + str[0];
  }

}
