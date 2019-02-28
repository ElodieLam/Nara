import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ILignedefraisListe } from '../gestionnotedefrais/gestionnotedefrais.interface';
import { ServicecomptandfComponent } from '../servicecomptandf/servicecomptandf.component';


@Component({
  selector: 'app-servicecomptaavance',
  templateUrl: './servicecomptaavance.component.html',
  styleUrls: ['./servicecomptaavance.component.css']
})
export class ServicecomptaavanceComponent implements OnInit, OnChanges {
  @Input() listavance : ILignedefraisListe[];
  private _listavance: ILignedefraisListe[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource;
  displayedColumns: string[] = ['nom_mission', 'libelle_ldf', 'montant_e', 'montant_a', 'commentaire_ldf', 'justif_ldf', 'statut_ldf', 'accepter', 'refuser', 'motif_refus'];

  constructor(private servicecomptandf : ServicecomptandfComponent) { }

  ngOnInit() {
    console.log(this.listavance)
    console.log(this._listavance)
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

  transfromStatut(statut : string) {
    if(statut == 'avval')
      return 'Validée'
    else if(statut == 'avattF')
      return 'Attente compta'
    else if(statut == 'avnoF')
      return 'Refusée compta'
  }

  refuserAvance(id : number) {
    this.servicecomptandf.refuserAvance(id);
  }

  accepterAvance(id : number) {
    this.servicecomptandf.accepterAvance(id);
  }


}
