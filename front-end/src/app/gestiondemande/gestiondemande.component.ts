import { Component, OnInit, Inject} from '@angular/core';
import {Router} from "@angular/router";
import { CongeService } from '../conge/conge.service';
import { GestioncongeService } from '../gestionconge/gestionconge.service';
import { IDemandeconge} from '../demandeconge/demandeconge.interface';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MAT_SNACK_BAR_DATA} from '@angular/material';
import { ICollaborateur } from '../gestionconge/collaborateur.interface';
import { IConge } from '../conge/conge.interface';
import { DemandeRefuseeComponent } from '../create-demandeconge/create-demandeconge.component';

@Component({
  selector: 'app-gestiondemande',
  templateUrl: './gestiondemande.component.html',
  styleUrls: ['./gestiondemande.component.css']
})

export class GestiondemandeComponent implements OnInit {

  demande: IDemandeconge;
  listeCollab: ICollaborateur[];
  infoConges : IConge[]

  constructor(private gestioncongeService: GestioncongeService, private congeService: CongeService, private router: Router, public dialogRef: MatDialogRef<GestiondemandeComponent>, @Inject(MAT_DIALOG_DATA) public data: any)
  { 
    this.demande = data;
  }

  onClick(statut)
  {
    if(statut)
    {
      this.demande.status_conge = "attRh";
    }
    else
    {
      this.demande.status_conge = "noCds"
      switch(this.demande.type_demande_conge)
      {
        case "rtt":
        {
          this.infoConges[0].rtt_pris -= this.demande.duree;
          this.infoConges[0].rtt_restant += this.demande.duree;
          break;
        }
        case "cp":
        {
          this.infoConges[0].cp_pris -= this.demande.duree;
          this.infoConges[0].cp_restant += this.demande.duree;
          break;
        }
        case "css":
        {
          this.infoConges[0].css_pris -= this.demande.duree;
          break;
        }
      }
      this.congeService.createConges(this.infoConges[0]) 
    }
    
    this.gestioncongeService.updateService(this.demande);
    this.dialogRef.close()
  }

  onCancel()
  {
    this.dialogRef.close();
  }

  ngOnInit() 
  {
    this.gestioncongeService
    .getCollabs()
      .subscribe((data : ICollaborateur[]) => {
      this.listeCollab = data;
    });

    this.congeService
    .getCongesFromIdCollab({id: this.demande.id_collab})
      .subscribe( (data : IConge[]) => {
      this.infoConges = data;
    });


  }

}
