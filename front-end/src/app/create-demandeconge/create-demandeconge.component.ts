import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import { DemandecongeService } from '../demandeconge/demandeconge.service';
import {Router} from "@angular/router";
import { IDemandeconge } from '../demandeconge/demandeconge.interface';

import { CongeService } from '../conge/conge.service';
import { IConge } from '../conge/conge.interface';




@Component({
  selector: 'app-create-demandeconge',
  templateUrl: './create-demandeconge.component.html',
  styleUrls: ['./create-demandeconge.component.css']
})
export class CreateDemandecongeComponent implements OnInit, OnChanges 
{
  newDemande: IDemandeconge = {id_collab: 6, id_demande_conge: null, date_debut: new Date(), date_fin: null, motif_refus: "", debut_matin: null, duree: null, fin_aprem: null, type_demande_conge: null, status_conge: 'attCds'};
  test: IConge = {id_collab: 6, rtt_restant: null, rtt_pris: null, cp_pris: null, cp_restant: null, css_pris: null}
  infoConge : IConge [] = [];
  isFilled = {type: false, start: false, am: false, end: false, pm: false}
  dateMin = new Date();
  dateMaxi = null;
  forcedAm = false;

  calculateDateMax(type)
  {
    var dateMax = new Date();

    var addweekend;
    var congerestants;

    if (type ==="rtt")
    {
      congerestants = this.infoConge[0].rtt_restant;
    }
    else if (type === "cp")
    {
      congerestants = this.infoConge[0].cp_restant;
    }
    else
    {
      dateMax.setDate(this.newDemande.date_debut.getDate()+365)
    }
    if (type === "rtt" || type === "cp")
    {
      if (congerestants % 2 == 0)
      {
        addweekend = this.getEntreDatesWithoutWeekend(this.newDemande.date_debut, congerestants/2);
        dateMax.setDate(this.newDemande.date_debut.getDate()+addweekend);
      }
      else
      {
        addweekend = this.getEntreDatesWithoutWeekend(this.newDemande.date_debut, Math.floor((congerestants)/2));
        dateMax.setDate(this.newDemande.date_debut.getDate()+addweekend);
      }
    }

    return dateMax;
  }
  
  resetDemande(into)
  {
    switch(into)
    {
      case 0:
      {
        this.isFilled.start = false;
        this.isFilled.am = false;
        this.isFilled.end = false;
        this.isFilled.pm = false;
        this.newDemande.date_debut = new Date();
        this.newDemande.date_debut.setHours(0,0,0,0);
        this.newDemande.date_debut = this.incrementeDate(this.newDemande.date_debut);
        while(this.newDemande.date_debut.getDay() == 0 || this.newDemande.date_debut.getDay() == 6)
        {
          this.newDemande.date_debut = this.incrementeDate(this.newDemande.date_debut);
        }
        this.newDemande.debut_matin = null;
        this.newDemande.date_fin = null;
        this.newDemande.fin_aprem = null;
        break;
      }
      case 1:
      {
        this.isFilled.am = false;
        this.isFilled.end = false;
        this.isFilled.pm = false;
        this.newDemande.debut_matin = null;
        this.newDemande.date_fin = null;
        

        break;
      }
      case 2:
      {
        this.isFilled.end = false;
        this.isFilled.pm = false;
        this.newDemande.date_fin = null;
        this.newDemande.fin_aprem = null;
        break;
      }
      case 3:
      {
        this.isFilled.pm = false;
        this.newDemande.fin_aprem = null;
        
        break;
      }

      case 4:
      {
        break;
      }
    }
  }
  fill(into)
  {
    switch(into)
    {
      case 0:
      {
        this.isFilled.type = true;
        this.resetDemande(into);
        
        break;
      }
      case 1:
      {
        this.isFilled.start = true;
        this.dateMaxi = this.calculateDateMax(this.newDemande.type_demande_conge);
        this.resetDemande(into);
        break;
      }
      case 2:
      {
        this.isFilled.am = true;
        this.resetDemande(into);
        break;
      }
      case 3:
      {
        this.isFilled.end = true;
        this.forcedAm = false;
        this.resetDemande(into);
        
        break;
      }

      case 4:
      {
        this.isFilled.pm = true;
        break;
      }
    }
  }

  myFilter = (d: Date): boolean => 
  {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  createDemande(data)
  {
    console.log("présent");
    data.duree  = this.calculDuree(data);
  
    var canCreate = false;

    switch(data.type_demande_conge)
    {
      case "rtt":
      {
        if (this.infoConge[0].rtt_restant - data.duree >= 0)
        {
          canCreate = true;
          this.infoConge[0].rtt_restant = this.infoConge[0].rtt_restant - data.duree;
          this.infoConge[0].rtt_pris = this.infoConge[0].rtt_pris + data.duree;
        }
        break;
      }
      case "cp":
      {
        if (this.infoConge[0].cp_restant - data.duree >= 0)
        {
          canCreate = true;
          this.infoConge[0].cp_restant = this.infoConge[0].cp_restant - data.duree;
          this.infoConge[0].cp_pris = this.infoConge[0].cp_pris + data.duree;
        }
        break;
      }
      case "cp":
      {
        canCreate = true;
        this.infoConge[0].css_pris = this.infoConge[0].css_pris + data.duree;
        break;
      }

    }

    
    if(canCreate)
    {
      data.date_debut.setDate(data.date_debut.getDate()+1);
      data.date_fin.setDate(data.date_fin.getDate()+1);
      data.date_debut.setHours(0,0,0,0);
      data.date_fin.setHours(0,0,0,0);
      this.congeService.createConges(this.infoConge[0]);
      this.demandecongeService.createDemandeconges(data);
      
    }

    else
    {
      this.openSnackBar()
    }
    
  }


  calculDuree(data)
  {
    var dates = this.getEntreDates(data.date_debut, data.date_fin);
    var diff = (dates.length)*2;
    
    for(var date of dates)
    {
      if (date.getDay() == 0 || date.getDay() == 6)
      {
        diff = diff - 2;
      }
    }
    if (data.debut_matin == 0)
    {
      diff = diff - 1;
    }

    if (data.fin_aprem == 0)
    {
      diff = diff - 1;
    }

    
    if (data.type_demande_conge === "rtt")
    {
      if (diff > this.infoConge[0].rtt_restant)
      {
        this.forcedAm = true;
      }
    }
    else if (data.type_demande_conge === "cp")
    {
      
      if (diff > this.infoConge[0].cp_restant)
      {
        this.forcedAm = true;
      }
    }
    else
    {
      this.forcedAm = false;
    }
    
    return diff;
  }

  //fonction retournant la liste des dates comprises entre les deux dates entrees
  getEntreDatesWithoutWeekend(datedebut, nbjours)
  {
    var dates = []
    var dateActuelle = new Date(datedebut);
    var datefin = new Date();
    datefin.setDate(dateActuelle.getDate()+(nbjours-1));
    dates = this.getEntreDates(dateActuelle, datefin);
    var compteur = 0;
    for(var date of dates)
    {
      if (date.getDay() == 0 || date.getDay() == 6)
      {
        compteur += 2;
      }
      else
      {
        compteur++;
      }
    }
    return compteur;


  }
  getEntreDates(datedebut, datefin)
  {
    var dates = [];
    var dateActuelle = new Date(datedebut);
    while(dateActuelle <= datefin)
    {
      
      dates.push(dateActuelle);
      dateActuelle = this.incrementeDate(dateActuelle);
    }
  
    return dates;
  }

  //fonction retournant le jour suivant de la date entree
  incrementeDate(date)
  {
    var newdate = new Date(date);
    newdate.setDate(newdate.getDate() + 1);
    return newdate;
  };

  openSnackBar() {
    this.snackBar.openFromComponent(DemandeRefuseeComponent, {
      duration: 2500,
    });
  }

  constructor(private demandecongeService: DemandecongeService , private congeService: CongeService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() 
  {
    this.congeService
    .getCongesFromIdCollab(this.test)
      .subscribe( (data : IConge []) => {
      this.infoConge = data;
    });

    this.newDemande.date_debut.setHours(0,0,0,0);
    this.newDemande.date_debut = this.incrementeDate(this.newDemande.date_debut);
    while(this.newDemande.date_debut.getDay() == 0 || this.newDemande.date_debut.getDay() == 6)
    {
      this.newDemande.date_debut = this.incrementeDate(this.newDemande.date_debut);
    }

    this.dateMin = this.newDemande.date_debut;

  }

  ngOnChanges()
  {

  }

}

@Component({
  selector: 'snack-bar-component-refuse-snack',
  templateUrl: 'snack-bar-component-refuse-snack.html',
  styles: [`
  .demande-refuse {
   text-align = center;
  }
`],
})
export class DemandeRefuseeComponent {}
