import { Component, OnInit, ViewChild } from '@angular/core';
import { DemandecongeService } from './demandeconge.service';
import {Router} from "@angular/router";
import { IDemandeconge } from './demandeconge.interface';
import { CalendarEvent, DAYS_OF_WEEK } from 'angular-calendar';
import {MatSort, MatTableDataSource} from '@angular/material';

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
  }
};

@Component({
  selector: 'app-demandeconge',
  templateUrl: './demandeconge.component.html',
  styleUrls: ['./demandeconge.component.css']
})
export class DemandecongeComponent implements OnInit 
{
  
  viewDate: Date = new Date();
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY; 

  events: CalendarEvent[] = [ ];

  activeDayIsOpen: boolean = true;

  listeDemande : IDemandeconge[];
  test: IDemandeconge = {id_collab: 6, id_demande_conge: null, date_debut: null, date_fin: null, motif_refus: null, debut_matin: null, duree: null, fin_aprem: null, type_demande_conge: null, status_conge: null}
  

  displayedColumn = ['id', 'type', 'datedebut', 'datefin', 'statut', 'duree'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;

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
    //todo, rediriger vers la demande de congé en question, à voir.
    window.open("ok");
  }

  fillEvent()
  {
    var typedem: string;
    var couleur;

    for(var demande of this.listeDemande)
    {
      switch(demande.type_demande_conge)
      {
        case "attCds":
        case "attRh" : 
        {
          couleur = colors.yellow;
          break;
        }

        case "noCds":
        case "noRH":
        {
          couleur = colors.red;
          break;
        }

        case "css":
        {
          typedem = "Congé sans Solde";
          break;
        }

      }
      
      
      
      switch(demande.type_demande_conge)
      {
        case "rtt":
        {
          typedem = "RTT";
          break;
        }

        case "cp":
        {
          typedem = "Congé Payé";
          break;
        }

        case "css":
        {
          typedem = "Congé sans Solde";
          break;
        }

      }
      this.events.push({

        start: new Date(demande.date_debut),
        end: new Date(demande.date_fin),
        title: typedem,
        color: colors.yellow ,

      })
      
    }
  }
  
  constructor(private demandecongeService: DemandecongeService , private router: Router) { }

  ngOnInit() 
  
  {
    this.demandecongeService
    .getDemandecongesFromIdCollab(this.test)
      .subscribe( (data : IDemandeconge[]) => {
      this.listeDemande = data;
      this.dataSource = new MatTableDataSource(this.listeDemande); 
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
      this.fillEvent();
      console.log(this.events);
    }); 
  }

}
