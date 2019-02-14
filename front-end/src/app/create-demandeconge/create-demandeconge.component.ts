import { Component, OnInit, ViewChild } from '@angular/core';
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
export class CreateDemandecongeComponent implements OnInit 
{
  newDemande: IDemandeconge = {id_collab: 6, id_demande_conge: null, date_debut: new Date(), date_fin: null, motif_refus: "", debut_matin: null, duree: null, fin_aprem: null, type_demande_conge: null, status_conge: 'attCds'};
  test: IConge = {id_collab: 6, rtt_restant: null, rtt_pris: null, cp_pris: null, cp_restant: null, css_pris: null}
  infoConge : IConge [] = [];
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
    
    return diff;
  }

  //fonction retournant la liste des dates comprises entre les deux dates entrees
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
