import { Component, OnInit, ViewChild } from '@angular/core';
import { DemandecongeService } from '../demandeconge/demandeconge.service';
import {Router} from "@angular/router";
import { IDemandeconge } from '../demandeconge/demandeconge.interface';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-historiqueconge',
  templateUrl: './historiqueconge.component.html',
  styleUrls: ['./historiqueconge.component.css']
})
export class HistoriquecongeComponent implements OnInit 

{
  listeDemande : IDemandeconge[];
  test: IDemandeconge = {id_collab: 6, id_demande_conge: null, date_debut: null, date_fin: null, motif_refus: null, debut_matin: null, duree: null, fin_aprem: null, type_demande_conge: null, status_conge: null}
    
  displayedColumn = ['id_demande_conge', 'type_demande_conge', 'date_debut', 'date_fin', 'status_conge', 'duree'];
  dataSource;
 
  @ViewChild(MatSort) sort: MatSort;

  constructor(private demandecongeService: DemandecongeService , private router: Router) { }
  ngOnInit() 
  {
    this.demandecongeService
    .getDemandecongesFromIdCollab(this.test)
      .subscribe( (data : IDemandeconge[]) => {
      this.listeDemande = data;
      this.dataSource = new MatTableDataSource<IDemandeconge>(this.listeDemande); 
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    });  
    
  }

}
