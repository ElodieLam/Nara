import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ILignedefraisListe } from '../gestionnotedefrais/gestionnotedefrais.interface';
import { GestionlignedefraisComponent } from '../gestionlignedefrais/gestionlignedefrais.component';

@Component({
  selector: 'app-gestionavance',
  templateUrl: './gestionavance.component.html',
  styleUrls: ['./gestionavance.component.css']
})
export class GestionavanceComponent implements OnInit, OnChanges {
  @Input() listavance : ILignedefraisListe[];
  private _listavance: ILignedefraisListe[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource;
  displayedColumns: string[] = ['nom_mission', 'libelle_ldf', 'montant', 'montant_dem',
  'commentaire_ldf', 'justif_ldf', 'statut_ldf', 'accepter', 'refuser', 'motif_refus'];

  constructor(private gestionlignedefrais : GestionlignedefraisComponent) { }

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
    this.dataSource = new MatTableDataSource<ILignedefraisListe>(this._listavance);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
  }

  refuserAvance(id : number, avance : boolean, statut : string) {
    this.gestionlignedefrais.refuserLdf(id, true, statut);
  }

  accepterAvance(id : number) {
    this.gestionlignedefrais.accepterAvance(id);
  }

}
