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

  createDemande(data)
  {
    console.log("présent");
    data.duree  = this.calculDuree(data);

    this.demandecongeService.createDemandeconges(data);
  }

  calculDuree(data)
  {
    var datefin = new Date(data.date_fin);
    var datedebut = new Date (data.date_debut);

    var diff = (((datefin.getTime() - datedebut.getTime())/86400000)+1)*2; //tranformer les milliseconde en jour (demi journee)
    if (data.debut_matin == "false")
    {
      diff = diff - 1;
    }

    if (data.fin_aprem == "false")
    {
      diff = diff - 1;
    }
    return diff;
  }

  constructor(private demandecongeService: DemandecongeService , private router: Router) { }

  ngOnInit() 
  {
  }

}
