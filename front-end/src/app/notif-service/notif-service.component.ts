import { Component, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { NotifService } from './notif.service';
import { INotifDemFull, INotifNdfFull, INotifServiceDisplay} from '../notif-service/notif.interface';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-notif-service',
  templateUrl: './notif-service.component.html',
  styleUrls: ['./notif-service.component.css']
})
export class Notif_ServiceComponent{

  ELEMENT_DATA: Element[] = [];

  private sub : any;
  displayedColumns = ['date_heure', 'collaborateur', 'notif'];
  dataSource; //= new MatTableDataSource(this.ELEMENT_DATA);
  lDemCongeFull: INotifDemFull[];
  lNdfFull: INotifNdfFull[];
  lNotifDisplay: INotifServiceDisplay[];
  mois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private notifService: NotifService, private login: LoginComponent) { 
    }

  ngOnInit() {
    this.lNotifDisplay = [];  
    //Récupération des notifs "Demande de congé"
    console.log("ID= " + this.login.user.id_collab);
    this.sub = this.notifService
    .getNotifDemCongeFromIdCds({id : this.login.user.id_collab})
    .subscribe( (data : INotifDemFull[]) => {
      if (data != null){
        this.lDemCongeFull = data;
      
        //Récupérations des infos à mettre dans le tableau
        this.lDemCongeFull.forEach( dem => {
          this.lNotifDisplay.push(
            { 'nom' : dem.nom, 
              'prenom' : dem.prenom, 
              'date' : dem.dateD.substring(0, 10) + " au " + dem.dateF.substring(0, 10), 
              'type' : (dem.dem == 1) ? "Demande de congé" : "Modification de congé", 
              'color': "orange", 
            });  
        });
      }
    })

    //Récupération des notifs "Note de frais"
    this.sub = this.notifService
    .getNotifNdfFromIdCds({id : this.login.user.id_collab})
    .subscribe( (data : INotifNdfFull[]) => {
    if (data != null){
      this.lNdfFull = data;

      //Récupérations des infos à mettre dans le tableau
      this.lNdfFull.forEach( ndf => {
        this.lNotifDisplay.push(
          { 'nom' : ndf.nom, 
            'prenom' : ndf.prenom, 
            'date' : this.mois[parseInt(ndf.mois, 10)],
            'type' : (ndf.avance == 1) ? "Demande d'avance" : "Note de frais", 
            'color': "cyan", 
        })
      });
    }


    //TODO Récupération des notifs COMPTA "Note de frais" 
    /*this.sub = this.notifService
    .getNotifNdfFromIdCompta({id : this.login.user.id_collab})
    .subscribe( (data : INotifNdfFull[]) => {
    if (data != null){
      this.lNdfFull = data;

      //Récupérations des infos à mettre dans le tableau
      this.lNdfFull.forEach( ndf => {
        this.lNotifDisplay.push(
          { 'nom' : ndf.nom, 
            'prenom' : ndf.prenom, 
            'date' : this.mois[parseInt(ndf.mois, 10)],
            'type' : (ndf.avance == 1) ? "Demande d'avance" : "Note de frais", 
        })
      });
    }*/
    
    //Affiche les éléments dans le tableau
    this.dataSource = new MatTableDataSource <INotifServiceDisplay> (this.lNotifDisplay);
    })

    
    

  }

  ngAfterViewInit() {

  }
  
}

export interface Element {
  date_heure: String,
  nom: String,
  prenom: String,
  date: String,
  type: String,
  color: String,
}






