import { Component, OnInit, ViewChild } from '@angular/core';
import { GestiondemandeComponent} from '../gestiondemande/gestiondemande.component';
import {ServiceRHService} from './servicerh.service'
import {Router} from "@angular/router";
import { IDemandeconge } from '../demandeconge/demandeconge.interface';
import { CalendarEvent, CalendarDateFormatter, DAYS_OF_WEEK, CalendarView } from 'angular-calendar';
import {MatSort, MatTableDataSource, MatDialog, MatPaginator} from '@angular/material';

import { CustomDateFormatter } from '../demandeconge/custom-date-formatter.provider';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { LoginComponent } from '../login/login.component';
import { ICollaborateur } from '../gestionconge/collaborateur.interface';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#50b63b',
    secondary: '#B0E6A6'
  }
};


@Component({
  selector: 'app-servicerh',
  templateUrl: './servicerh.component.html',
  styleUrls: ['./servicerh.component.css']
})
export class ServicerhComponent implements OnInit {

  viewDate: Date = new Date();
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY; 

  events: CalendarEvent[] = [ ];
  view: CalendarView = CalendarView.Month;
  activeDayIsOpen: boolean = false;
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
  }

  listeDemande : IDemandeconge[];

  listeCollab: ICollaborateur[] = [];

  displayedColumn = ['nom_collab', 'prenom_collab', 'type_demande_conge', 'date_debut', 'date_fin', 'status_conge', 'duree', 'voir'];
  user = "0";
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void 
  {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventClicked(event: CalendarEvent): void 
  {
    if(this.listeDemande[this.events.indexOf(event)].status_conge === "attRh")
    {
      this.openDialog(this.listeDemande[this.events.indexOf(event)])
    }
    
  }

  openDialog(demande): void {
    const dialogRef = this.dialog.open(GestiondemandeComponent, {data:demande });
  }

  fillEvent()
  {
    var typedem: string;
    var couleur;

    for(var demande of this.listeDemande)
    {
      switch(demande.status_conge)
      {
        case "attCds":
        {
          couleur = colors.blue;
          break;
        }
        case "attRh" : 
        {
          couleur = colors.yellow;
          break;
        }

        case "noCds":
        case "noRh":
        {
          couleur = colors.red;
          break;
        }

        case "validee":
        {
          couleur = colors.green;
          break;
        }

      }
      
    
      typedem = this.listeCollab[demande.id_collab-1].nom_collab + " " + this.listeCollab[demande.id_collab-1].prenom_collab + " : "
      
      
      switch(demande.type_demande_conge)
      {
        case "rtt":
        {
          typedem += "RTT";
          break;
        }

        case "cp":
        {
          typedem += "Congé Payé";
          break;
        }

        case "css":
        {
          typedem += "Congé sans Solde";
          break;
        }

      }
      typedem += " - " + demande.status_conge
      this.events.push({

        start: new Date(demande.date_debut),
        end: new Date(demande.date_fin),
        title: typedem,
        color: couleur,

      })
      
    }
  }
  constructor(private serviceRHservice: ServiceRHService, private router: Router, private login : LoginComponent, public dialog: MatDialog) 
  {
    this.user = login.user.id_collab.toString();
  }

  ngOnInit() 
  {
    this.serviceRHservice
    .getDemandecongesFromIdRH({id : this.user})
      .subscribe( (data : IDemandeconge[]) => {
      this.listeDemande = data;
      this.dataSource = new MatTableDataSource(this.listeDemande); 
      this.dataSource.sort = this.sort;
      setTimeout(() => this.dataSource.paginator = this.paginator);
     
      this.serviceRHservice
      .getCollabs()
        .subscribe((data : ICollaborateur[]) => {
        this.listeCollab = data;
        this.fillEvent();
      });
    }); 
  }

}




  
