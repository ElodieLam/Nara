import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ILignedefraisListe } from '../gestionnotedefrais/gestionnotedefrais.interface';
import { GestionlignedefraisComponent } from '../gestionlignedefrais/gestionlignedefrais.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-gestionavance',
  templateUrl: './gestionavance.component.html',
  styleUrls: ['./gestionavance.component.css']
})
/**
 * Responsable : Alban Descottes
 * Component qui représente les demandes d'avances de la note de frais visualisée
 * Accessible pour tous les chefs de service
 * Version mobile et ordinateur
 */
export class GestionavanceComponent implements OnInit, OnChanges {
  @Input() listavance : ILignedefraisListe[];
  private _listavance: ILignedefraisListe[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource;
  displayedColumns: string[] = ['nom_mission', 'libelle_ldf', 'montant', 'montant_dem',
  'commentaire_ldf', 'justif_ldf', 'statut_ldf', 'accepter', 'refuser', 'motif_refus'];
  dataSourceMobile;
  displayedColumnsMobile: string[] = ['ldf'];
  mobileVersion:boolean = false;

  constructor(private gestionlignedefrais : GestionlignedefraisComponent, private login : LoginComponent) {
    this.mobileVersion = this.login.mobileVersion;
   }

  ngOnInit() {
  }
  
  
  ngOnChanges(changes: SimpleChanges) {
    const listavance: SimpleChange = changes.listavance;
    this._listavance = listavance.currentValue; 
    this.delay(1000).then(any => {
      this.refresh();
    });
    
  }

  refresh() {
    if(this.mobileVersion) {
      this.dataSourceMobile = new MatTableDataSource<ILignedefraisListe>(this._listavance);
      this.dataSourceMobile.paginator = this.paginator;
    }
    else {
      this.dataSource = new MatTableDataSource<ILignedefraisListe>(this._listavance);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
  }

  transformStatut(statut : string) {
    if(statut == 'noCds' || statut == 'noF' || statut == 'val'
    || statut == 'attCds' || statut == 'attF' || statut == 'noSent')
      return 'Validée'
    if(statut == 'avnoCds')
      return 'Refus du Chef de service'
    if(statut == 'avnoF')
      return 'Refus de laCompta'
    if(statut == 'avattCds')
      return 'En attente du Chef de service'
    if(statut == 'avattF')
      return 'En attente de la Compta'
    return 'unknown'
  }

  refuserAvance(id : number, avance : boolean, statut : string) {
    this.gestionlignedefrais.refuserLdf(id, avance, statut);
  }

  accepterAvance(id : number) {
    this.gestionlignedefrais.accepterAvance(id);
  }

}
