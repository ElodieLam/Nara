import { Component, OnInit, ViewChild } from '@angular/core';
import { DemandecongeService } from '../demandeconge/demandeconge.service';
import {Router} from "@angular/router";
import { IDemandeconge } from '../demandeconge/demandeconge.interface';
import {MatSort, MatTableDataSource, MatPaginator, MatSnackBar} from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { CongeService } from '../conge/conge.service';
import { IConge } from '../conge/conge.interface';
import { DemandeRefuseeComponent } from '../create-demandeconge/create-demandeconge.component';

/**Responsable Mohamed Beldi, accessible pour tous les collaborateurs 
 * 
 * Component contenant toutes les demandes de congés du collaborateur, il peut entre autre en supprimer une en attente CdS ou Rh s'il est CdS 
 * */

@Component({
  selector: 'app-historiqueconge',
  templateUrl: './historiqueconge.component.html',
  styleUrls: ['./historiqueconge.component.css']
})
export class HistoriquecongeComponent implements OnInit 

{
  listeDemande : IDemandeconge[];
  infoConges : IConge[];
  user = 0;
  isCds = false;
    
  displayedColumn = ['type_demande_conge', 'date_debut', 'date_fin', 'status_conge', 'duree', 'supprimer'];
  dataSource;

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
  }
 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private demandecongeService: DemandecongeService, private snackBar: MatSnackBar, private congeService : CongeService, private router: Router, private login: LoginComponent) 
  { 
    this.user = login.user.id_collab;
    this.isCds = this.login.user.isCDS; 
  }

  /** Quand le collaborateur supprime la demande on remet ses infos Congés à jour (s'il avait pris des rtt, on remet son compteur)
   * et on met à jour sa liste de demande. On refresh ensuite le component, que l'utilisateur puisse voir son changement
   */
  supprimerDemande(demande)
  {

    switch(demande.type_demande_conge)
      {
        case "rtt":
        {
          this.infoConges[0].rtt_pris -= demande.duree;
          this.infoConges[0].rtt_restant += demande.duree;
          break;
        }
        case "cp":
        {
          this.infoConges[0].cp_pris -= demande.duree;
          this.infoConges[0].cp_restant += demande.duree;
          break;
        }
        case "css":
        {
          this.infoConges[0].css_pris -= demande.duree;
          break;
        }
      }
    this.congeService.createConges(this.infoConges[0]);
    this.demandecongeService.deleteDemandeconges(demande);
    this.delay(1500).then(any => {
      this.router.navigateByUrl('/refresh', {skipLocationChange: true}).then(()=>
      this.router.navigate(["/historiqueconge"])); 
      this.openSnackBar('Demande de congé supprimée !!');
    
    });

  }

  /**
   * permet simplement d'ouvrir un snackbar avertissant l'utilisateur de son changement 
   * 
   * */
  openSnackBar(msg: string) {
    this.snackBar.openFromComponent(DemandeRefuseeComponent, {
      duration: 1000,
      data : msg
    });
  }

  ngOnInit() 
  {
    this.demandecongeService
    .getDemandecongesFromIdCollab({id : this.user})
      .subscribe( (data : IDemandeconge[]) => {
      this.listeDemande = data;
      this.dataSource = new MatTableDataSource<IDemandeconge>(this.listeDemande); 
      this.dataSource.sort = this.sort;
      setTimeout(() => this.dataSource.paginator = this.paginator);
    });  

    this.congeService
    .getCongesFromIdCollab({id: this.user})
      .subscribe( (data : IConge[]) => {
      this.infoConges = data;
    });
    
  }

}
