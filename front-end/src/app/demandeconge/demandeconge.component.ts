import { Component, OnInit, ViewChild } from '@angular/core';
import { DemandecongeService } from './demandeconge.service';
import {Router} from "@angular/router";
import { IDemandeconge } from './demandeconge.interface';
import { CalendarEvent, CalendarDateFormatter, DAYS_OF_WEEK, CalendarView } from 'angular-calendar';
import {MatSort, MatTableDataSource, MatDialog} from '@angular/material';
import { CustomDateFormatter } from './custom-date-formatter.provider';
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
/**
 * Responsable : Mohamed Beldi, accessible à tous les collaborateurs
 * 
 * Component contenant toutes les deamndes d'un collaborateur dans un gros calendrier 
 * */
@Component({
  selector: 'app-demandeconge',
  templateUrl: './demandeconge.component.html',
  styleUrls: ['./demandeconge.component.css'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class DemandecongeComponent implements OnInit 
{
  
  viewDate: Date = new Date();
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY; 

  events: CalendarEvent[] = [ ];
  view: CalendarView = CalendarView.Month;
  activeDayIsOpen: boolean = false;

  listeDemande : IDemandeconge[];
  user = "0";
  dataSource;

  @ViewChild(MatSort) sort: MatSort;

  /**Fonction permettant d'afficher les demandes d'un jour s'il y en a en cliquant dessus */
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

  /** Gère le fait de cliquer sur une demande et redirige vers l'historique des demandes si c'est le cas */
  eventClicked(event: CalendarEvent): void 
  {
    this.router.navigateByUrl('/historiqueconge')
  }

  /** 
   * Fonction qui permet de remplir les évenements du calendrier avec les demandes et de set la couleur et le titre adéquat
   * en fonction des attributs de la demande
   */
  fillEvent()
  {
    var typedem: string;
    var couleur;

    for(var demande of this.listeDemande)
    {
      if(demande.id_collab.toString() != this.user)
      {
        couleur = colors.blue;
      }
      else
      {
        switch (demande.status_conge) {
          case "attCds":
          case "attRh":
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
      typedem += " : " + demande.status_conge
      this.events.push({

        start: new Date(demande.date_debut),
        end: new Date(demande.date_fin),
        title: typedem,
        color: couleur ,

      })
      
    }
  }
  /** Dans le constructeur on récupère uniquement l'id à partir du component du login */
  constructor(private demandecongeService: DemandecongeService , private router: Router, private login : LoginComponent) 
  {
    this.user = login.user.id_collab.toString();
  }
  /** À l'initialisation on récupère uniquement la liste des demandes du collaborateur
   */
  ngOnInit() 
  
  {
    this.demandecongeService
    .getDemandecongesServiceFromIdCollab({id : this.user})
      .subscribe( (data : IDemandeconge[]) => {
      this.listeDemande = data;
      this.dataSource = new MatTableDataSource(this.listeDemande); 
      this.dataSource.sort = this.sort;
      this.fillEvent();
    }); 
  }

}
