import { Component, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort} from '@angular/material';
import { NotifService } from './notif.service';
import { INotif} from './notif.interface';
import { LoginComponent } from '/Users/Elodie/Nara/front-end/src/app/login/login.component';


@Component({
  selector: 'app-notif',
  templateUrl: './notif.component.html',
  styleUrls: ['./notif.component.css']
})
export class NotifComponent{

  ELEMENT_DATA: Element[] = [];

  private sub : any;
  lDemConge: INotif[];
  lNdf: INotif[];
  lModConge: INotif[];
  displayedColumns = ['date_heure', 'notif'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  listIdDem: Number[];
  
  

  @ViewChild(MatSort) sort: MatSort;

  constructor(private notifService: NotifService, private login: LoginComponent) { 
    }

  ngOnInit() {

    //TODO fix
    this.sub = this.notifService
    .getNotifDemCongeFromIdCollab({id : this.login.user.id_collab})
    .subscribe( (data : INotif[]) => {
      // récupération des données de la query
      this.lDemConge = data;
      
      console.log("ngOnInit: " + this.lDemConge[0].id_action);
      
    })

    /*this.sub = this.notifService
    .getNotifModCongeFromIdCollab({id : this.login.user.id_collab})
    .subscribe( (data : INotif[]) => {
      // récupération des données de la query
      this.lModConge = data;
      console.log("Notif mod conge: " + this.lModConge);
    })

    this.sub = this.notifService
    .getNotifNdfFromIdCollab({id : this.login.user.id_collab})
    .subscribe( (data : INotif[]) => {
      // récupération des données de la query
      this.lNdf = data;
      console.log("Notif ndf: " + this.lNdf);
    })*/

    //TODO Store notif infos to display
    var test = [1,2]; 
    for ( let c of test ) {
      this.ELEMENT_DATA.push({date_heure: "00/00/00", id_action: c, id_collab: 6})
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  
}

export interface Element {
  date_heure: string,
  id_action: Number,
  id_collab: Number
}






