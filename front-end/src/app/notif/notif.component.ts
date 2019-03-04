import { Component, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { NotifService } from './notif.service';
import { INotifDisplay, INotif} from './notif.interface';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-notif',
  templateUrl: './notif.component.html',
  styleUrls: ['../notif-service/notif-service.component.css']
})
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

  constructor(private notifService: NotifService, private login: LoginComponent) { 
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
              'date_notif' : new Date(),
              'date' : element.dateD.substring(0, 10) + " au " + element.dateF.substring(0, 10),
              'type' : element.dem ? "Demande de congé" : "Modification de congé", 
              'statut' : "Statut: " + this.transformStatus(element.statut),
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


  transformStatus(status : String) : String {
    for(var i = 0; i < this.status.length ; i ++){
      if(this.status[i].key == status)
        return this.status[i].value;
    }
    return 'statut undefined'
  }

}
