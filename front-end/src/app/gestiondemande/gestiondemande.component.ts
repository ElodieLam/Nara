import { Component, OnInit, Inject} from '@angular/core';
import {Router} from "@angular/router";
import { CongeService } from '../conge/conge.service';
import { GestioncongeService } from '../gestionconge/gestionconge.service';
import { IDemandeconge} from '../demandeconge/demandeconge.interface';
import {MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MAT_SNACK_BAR_DATA} from '@angular/material';
import { ICollaborateur } from '../gestionconge/collaborateur.interface';
import { IConge } from '../conge/conge.interface';
import { DemandeRefuseeComponent } from '../create-demandeconge/create-demandeconge.component';
import { IInfoConge } from '../gestionconge/gestionconge.interface';

@Component({
  selector: 'app-gestiondemande',
  templateUrl: './gestiondemande.component.html',
  styleUrls: ['./gestiondemande.component.css']
})

export class GestiondemandeComponent implements OnInit {

  demande: IDemandeconge;
  infoConges : IInfoConge[];
  infoCollab : IInfoConge = {
    id_collab : 0,
    nom_collab : '',
    prenom_collab : '',
    nom_service : '',
    cp_pris : 0,
    cp_restant : 0,
    css_pris : 0,
    rtt_pris : 0,
    rtt_restant : 0
  };
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
  }

  constructor(private gestioncongeService: GestioncongeService, private congeService: CongeService, private router: Router, public dialogRef: MatDialogRef<GestiondemandeComponent>, @Inject(MAT_DIALOG_DATA) public data: any)
  { 
    this.demande = data;
  }

  onClick(statut)
  {
    var isRh = false;
    if(this.demande.status_conge === "attRh")
    {
      isRh = true;
    }

    if(statut)
    {
      if(isRh)
      {
        this.demande.status_conge = "validee";
      }
      else
      {
        this.demande.status_conge = "attRh";
      }
    }
    else
    {
      if(isRh)
      {
        this.demande.status_conge = "noRh"
      }
      else
      {
        this.demande.status_conge = "noCds"
      }
      
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
    this.delay(1500).then(any => {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>{
      if(isRh)
      {
        this.router.navigate(["/servicerh"]);
      }
      else
      {
        this.router.navigate(["/gestionconge"]);
      }
    }); 
    });
    this.dialogRef.close()
  }

  onCancel()
  {
    this.dialogRef.close();
  }

  ngOnInit() 
  {
    this.gestioncongeService
      .getInfoCollab({id : this.demande.id_collab})
      .subscribe( (data : IInfoConge[]) => {
        this.infoConges = data;
        if(this.infoConges.length > 0)
        this.infoCollab = this.infoConges[0];
      })
 }

}
