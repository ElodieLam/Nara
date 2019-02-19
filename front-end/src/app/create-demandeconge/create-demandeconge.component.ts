import { Component, OnInit, ViewChild, OnChanges, Inject } from '@angular/core';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA} from '@angular/material';
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
  newDemande: IDemandeconge = {id_collab: 0, id_demande_conge: null, date_debut: new Date(), date_fin: null, motif_refus: "", debut_matin: null, duree: null, fin_aprem: null, type_demande_conge: null, status_conge: 'attCds'};
  //test: IConge = {id_collab: 6, rtt_restant: null, rtt_pris: null, cp_pris: null, cp_restant: null, css_pris: null}
  listeDemande: IDemandeconge [] = [];
  infoConge : IConge [] = [];
  isFilled = {type: false, start: false, am: false, end: false, pm: false}
  dateMin = new Date();
  dateMaxi = null;
  forcedAm = false;
  forcedPm = false;
  user = 0;

  

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
      if (congerestants == 2 && Number(this.newDemande.debut_matin) || congerestants == 1)
      {
        console.log("maispqçamarchyepas")
        dateMax.setDate(this.newDemande.date_debut.getDate());
      }
      
      
      else if (congerestants % 2 == 0)
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
        this.dateMaxi = this.calculateDateMax(this.newDemande.type_demande_conge);
        this.resetDemande(into);
        break;
      }
      case 3:
      {
        this.isFilled.end = true;
        this.forcedAm = false;
        this.forcedPm = false;
        if (this.newDemande.date_debut.getTime() === this.newDemande.date_fin.getTime() && !Number(this.newDemande.debut_matin))
        {
          this.forcedPm = true;
        }
        this.resetDemande(into);
        
        break;
      }

      case 4:
      {
        this.isFilled.pm = true;
        console.log(this.checkDemande())
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

  checkDemande()
  {
    
    var possible = true;
    var datedebut = new Date(this.newDemande.date_debut);
    var datefin = new Date(this.newDemande.date_fin);
    datedebut.setDate(this.newDemande.date_debut.getDate())
    datefin.setDate(this.newDemande.date_fin.getDate())
    datedebut.setHours(0,0,0,0);
    datefin.setHours(0,0,0,0);

    var finaprem = Number(this.newDemande.fin_aprem)
    var debutmatin = Number(this.newDemande.debut_matin)

    var tempfin;
    var tempdebut;
    
    for (var demande of this.listeDemande)
    {
      tempdebut = new Date(demande.date_debut);
      tempfin = new Date(demande.date_fin)
      console.log(datefin)
      console.log(tempdebut)
      if ((datedebut >tempdebut &&  datedebut < tempfin) || (datefin > tempdebut && datefin < tempfin))
      {
        console.log("caz 1")
        possible = false;
      }

      if ((tempdebut > datedebut &&  tempdebut < datefin) || (tempfin > datedebut && tempfin < datefin))
      {
        console.log("caz 2")
        possible = false;
      }

      
      if (tempdebut.getTime() === datefin.getTime())
      {
        console.log("c'est étrange")
        console.log(demande.debut_matin)

        console.log(finaprem)

        if (!demande.debut_matin && !finaprem)
        {
          //rien c'est ok
          console.log("c'est ok pour moi")
        }
        else if(tempdebut.getTime() === tempfin.getTime())
        {
          if((demande.debut_matin && debutmatin) || (demande.fin_aprem && finaprem))
          {
            possible = false;
          }
        }
        else
        {
          possible = false;
        }
      }
      else if (tempfin.getTime() === datedebut.getTime())
      {
        
        if (!demande.fin_aprem && !debutmatin)
        {
          console.log("c'est ok pour moi aussi")
        }
        else if(tempdebut.getTime() === tempfin.getTime())
        {
          if((demande.debut_matin && debutmatin) || (!demande.fin_aprem && finaprem))
          {
            possible = false;
          }
        }
        else
        {
          possible = false;
        }
      }
    }
    return possible;
  }

  createDemande(data)
  {
    console.log("présent");
    data.duree  = this.calculDuree(data);
    var info = this.infoConge[0]
    var canCreate = false;

    switch(data.type_demande_conge)
    {
      case "rtt":
      {
        if (info.rtt_restant - data.duree >= 0)
        {
          canCreate = true;
          if (this.checkDemande())
          {
            info.rtt_restant = info.rtt_restant - data.duree;
            info.rtt_pris = info.rtt_pris + data.duree;
          }
          
  
        }
        break;
      }
      case "cp":
      {
        if (info.cp_restant - data.duree >= 0)
        {
          canCreate = true;
          if (this.checkDemande())
          {
            info.cp_restant = info.cp_restant - data.duree;
            info.cp_pris = info.cp_pris + data.duree;
          }

        }
        break;
      }
      case "css":
      {
        canCreate = true;
        if (this.checkDemande())
        {
          info.css_pris = info.css_pris + data.duree;
        }
       
        break;
      }

    }


    canCreate = this.checkDemande();
    if(canCreate)
    {
      data.date_debut.setDate(data.date_debut.getDate()+1);
      data.date_fin.setDate(data.date_fin.getDate()+1);
      data.date_debut.setHours(0,0,0,0);
      data.date_fin.setHours(0,0,0,0);
      this.congeService.createConges(info);
      this.demandecongeService.createDemandeconges(data);
      this.dialogRef.close();
      
    }

    else
    {
      info = this.infoConge[0]
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
  onCancel()
  {
    this.dialogRef.close();
  }
  openSnackBar() {
    this.snackBar.openFromComponent(DemandeRefuseeComponent, {
      duration: 2500,
    });
  }

  constructor(private demandecongeService: DemandecongeService , private congeService: CongeService, 
    private router: Router, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateDemandecongeComponent>, @Inject(MAT_DIALOG_DATA) public data: any) 
    {
      this.user = data;
    }

  ngOnInit() 
  {
    this.congeService
    .getCongesFromIdCollab({id : this.user})
      .subscribe( (data : IConge []) => {
      this.infoConge = data;
    });

    this.demandecongeService
    .getDemandecongesFromIdCollab({id : this.user})
      .subscribe( (data : IDemandeconge []) => {
      this.listeDemande = data;
    });
    this.newDemande.id_collab = this.user;
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
