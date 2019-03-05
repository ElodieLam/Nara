import { Component, OnInit, ViewChild } from '@angular/core';
import { DemandecongeService } from '../demandeconge/demandeconge.service';
import {Router} from "@angular/router";
import { IDemandeconge } from '../demandeconge/demandeconge.interface';
import {MatSort, MatTableDataSource, MatPaginator, MatSnackBar} from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { CongeService } from '../conge/conge.service';
import { IConge } from '../conge/conge.interface';
import { DemandeRefuseeComponent } from '../create-demandeconge/create-demandeconge.component';

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
  test: IDemandeconge = {id_collab: 6, id_demande_conge: null, date_debut: null, date_fin: null, motif_refus: null, debut_matin: null, duree: null, fin_aprem: null, type_demande_conge: null, status_conge: null}
    
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
  }

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
      console.log(this.dataSource);
    });  

    this.congeService
    .getCongesFromIdCollab({id: this.user})
      .subscribe( (data : IConge[]) => {
      this.infoConges = data;
    });
    
  }

}
