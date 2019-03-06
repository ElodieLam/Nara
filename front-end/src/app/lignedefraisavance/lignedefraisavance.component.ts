import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ILignedefrais } from '../lignedefrais/lignedefrais.interface'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { LignedefraisComponent } from '../lignedefrais/lignedefrais.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-lignedefraisavance',
  templateUrl: './lignedefraisavance.component.html',
  styleUrls: ['./lignedefraisavance.component.css']
})
/**
 * Responsable : Alban Descottes
 * Component qui représente toutes les avances d'une note de frais 
 * Accessible pour tous les collaboratteus
 * Version mobile et ordinateur
 */
export class LignedefraisavanceComponent implements OnInit, OnChanges {
  @Input() listavance : ILignedefrais[];
  private _listavance: ILignedefrais[];
  @Input() heure: string;
  private _heure: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource;
  displayedColumns: string[] = ['status', 'mission', 'date',
  'libelle', 'montant', 'montant_dem', 'commentaire', 'justificatif', 'modifier', 'supprimer'];
  dataSourceMobile;
  displayedColumnsMobile: string[] = ['ldf'];
  montantTotalAvance: number = 0;
  mobileVersion:boolean = false;

  constructor(private lignedefrais : LignedefraisComponent, private login : LoginComponent) {
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
    this.montantTotalAvance = 0; 
    this._listavance.forEach(element => {
      this.montantTotalAvance += +element.montant_avance;
    });
    if(this.mobileVersion){
      this.dataSourceMobile = new MatTableDataSource<ILignedefrais>(this._listavance);
      this.dataSourceMobile.paginator = this.paginator;
    }
    else {
      this.dataSource = new MatTableDataSource<ILignedefrais>(this._listavance);
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

  modifPossible(ldf : ILignedefrais) : boolean {
    if( ldf.status == 'Avance non envoyée' ||
        ldf.status == 'Avance attente CDS' ||
        ldf.status == 'Avance refusée CDS' ||
        ldf.status == 'Avance refusée Compta') 
        return true;
    return false;
  }

  supprPossible(ldf : ILignedefrais) : boolean{
    if( ldf.status == 'Avance non envoyée' ||
        ldf.status == 'Avance attente CDS' ||
        ldf.status == 'Avance refusée CDS' ||
        ldf.status == 'Avance refusée Compta') 
        return true;
    return false;
  }

  openDialogModifierAvance(element : ILignedefrais) {
    this.lignedefrais.openDialogModifierAvance(element);
  }
  supprLignedefrais(element : ILignedefrais) {
    this.lignedefrais.supprLignedefrais(element);
  }
}
