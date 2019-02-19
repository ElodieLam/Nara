import { Component, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import { NotifService } from '../notif-service/notif.service';
import { INotifDemFull2, INotifNdfFull2, INotifDisplay} from '../notif-service/notif.interface';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-notif',
  templateUrl: './notif.component.html',
  styleUrls: ['../notif-service/notif-service.component.css']
})
export class NotifComponent{

  ELEMENT_DATA: Element[] = [];

  private sub : any;
  displayedColumns = ['date_heure', 'notif'];
  dataSource; //= new MatTableDataSource(this.ELEMENT_DATA);
  lDemCongeFull: INotifDemFull2[];
  lNdfFull: INotifNdfFull2[];
  lNotifDisplay: INotifDisplay[];
  mois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  values:boolean = true;

  status : any[] = [
    {key: 'validee', value : 'Validée'},
    {key: 'refusee', value : 'Refusée'}
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private notifService: NotifService, private login: LoginComponent) { 
    }

  ngOnInit() {
    this.lNotifDisplay = [];  

    //Récupération des notifs "Demande de congé"
    this.sub = this.notifService
    .getNotifDemCongeFromId({id : this.login.user.id_collab})
    .subscribe( (data : INotifDemFull2[]) => {
      if (data != null){
        this.lDemCongeFull = data;
        //Récupérations des infos à mettre dans le tableau
        this.lDemCongeFull.forEach( dem => {
          if (dem.statut == "validee" || dem.statut == "refusee"){
            this.lNotifDisplay.push(
              { 
                'date' : dem.dateD.substring(0, 10) + " au " + dem.dateF.substring(0, 10), 
                'type' : (dem.dem == 1) ? "Demande de congé" : "Modification de congé", 
                'statut' : "Statut: " + this.transformStatus(dem.statut), 
                'color': "orange", 
                'dateNotif': "not defined yet"
              });   
          }      
        });
      }
    })

    //Récupération des notifs "Note de frais"
    this.sub = this.notifService
    .getNotifNdfFromId({id : this.login.user.id_collab})
    .subscribe( (data : INotifNdfFull2[]) => {
      this.lNdfFull = data;

      //Récupérations des infos à mettre dans le tableau
      this.lNdfFull.forEach( ndf => {
        var date = new Date(ndf.date);
        this.lNotifDisplay.push(
          { 
            'date' : this.mois[parseInt(ndf.mois, 10)],
            'type' : (ndf.avance == 1) ? "Avance de note de frais" : "Note de frais", 
            'statut' : (ndf.acceptee == 1) ? "Lignes validées" : "Lignes refusées",
            'color': "cyan", 
            'dateNotif': date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " - " + date.getMinutes() + ":" + date.getHours()
        })
      });
    
    //Affiche les éléments dans le tableau
    this.dataSource = new MatTableDataSource <INotifDisplay> (this.lNotifDisplay);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if(this.lNotifDisplay.length == 0) {
      this.values = false;
    }

    })

  }

  ngAfterViewInit() {

  }


  transformStatus(status : String) : String {
    for(var i = 0; i < this.status.length ; i ++){
      if(this.status[i].key == status)
        return this.status[i].value;
    }
    return 'statut undefined'
  }

}

export interface Element {
  nom: String,
  prenom: String,
  date: String,
  type: String,
  color: String,
  dateNotif: string,
}



