import { Component, OnInit, ViewChild } from '@angular/core';
import { DemandecongeService } from '../demandeconge/demandeconge.service';
import {Router} from "@angular/router";
import { IDemandeconge } from '../demandeconge/demandeconge.interface';

@Component({
  selector: 'app-create-demandeconge',
  templateUrl: './create-demandeconge.component.html',
  styleUrls: ['./create-demandeconge.component.css']
})
export class CreateDemandecongeComponent implements OnInit 
{
  typeDemande : ['RTT', 'Congé Payé', 'Congé sans Solde'];
  newDemande: IDemandeconge = {id_collab: 6, id_demande_conge: null, date_debut: new Date(), date_fin: new Date(), motif_refus: "", debut_matin: null, duree: null, fin_aprem: null, type_demande_conge: null, status_conge: 'attCds'};

  dateMin = new Date();

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

    this.demandecongeService.createDemandeconges(data);
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
    
    return diff;
  }

  getEntreDates(datedebut, datefin)
  {
    var dates = [];
    var dateActuelle = new Date(datedebut);
    while(dateActuelle <= datefin)
    {
      dateActuelle = this.incrementeDate(dateActuelle);
      dates.push(dateActuelle);
    }
  
    return dates;
  }

  incrementeDate(date)
  {
    var newdate = new Date(date);
    newdate.setDate(newdate.getDate() + 1);
    return newdate;
  };


  constructor(private demandecongeService: DemandecongeService , private router: Router) { }

  ngOnInit() 
  {
    this.newDemande.date_debut.setHours(0,0,0,0);
    this.newDemande.date_fin.setHours(0,0,0,0);
  }

}
