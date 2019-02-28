import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ILignedefrais } from '../lignedefrais/lignedefrais.interface'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { LignedefraisComponent } from '../lignedefrais/lignedefrais.component';

@Component({
  selector: 'app-lignedefraisavance',
  templateUrl: './lignedefraisavance.component.html',
  styleUrls: ['./lignedefraisavance.component.css']
})


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
  montantTotalAvance: number = 0;

  constructor(private lignedefrais : LignedefraisComponent) { }

  ngOnInit() {
    console.log('on init');
    console.log(this.listavance)
    console.log(this._listavance)
    console.log('mattable')
  }
  
  
  ngOnChanges(changes: SimpleChanges) {
    console.log('on changes')
    console.log(this._listavance)
    const listavance: SimpleChange = changes.listavance;
    this._listavance = listavance.currentValue; 
    this.delay(1000).then(any => {
      this.refresh();
    });
    
  }

  refresh() {
    this.montantTotalAvance = 0; 
    this._listavance.forEach(element => {
      console.log(this.montantTotalAvance)
      this.montantTotalAvance += +element.montant_avance;
    });
    this.dataSource = new MatTableDataSource<ILignedefrais>(this._listavance);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.lignedefrais.openDialogModifierAvance(element)
  }
  supprLignedefrais(element : ILignedefrais) {
    this.lignedefrais.supprLignedefrais(element)
  }

}
