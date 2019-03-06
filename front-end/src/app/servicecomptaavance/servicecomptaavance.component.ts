import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ILignedefrais } from '../servicecompta/servicecompta.interface';
import { ServicecomptandfComponent } from '../servicecomptandf/servicecomptandf.component';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-servicecomptaavance',
  templateUrl: './servicecomptaavance.component.html',
  styleUrls: ['./servicecomptaavance.component.css']
})

/**
 * Responsable : Alban Descottes
 * Component qui affiche les demandes d'avances d'une note de frais pour le service compta
 * Accessible pour le service compta
 * Version mobile et oridinateur
 */
export class ServicecomptaavanceComponent implements OnInit, OnChanges {
  @Input() listavance : ILignedefrais[];
  private _listavance: ILignedefrais[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource;
  displayedColumns: string[] = ['nom_mission', 'libelle_ldf', 'montant_e', 'montant_a', 'commentaire_ldf', 'justif_ldf', 'statut_ldf', 'accepter', 'refuser', 'motif_refus'];
  dataSourceMobile;
  displayedColumnsMobile: string[] = ['ldf'];
  mobileVersion:boolean = false;

  constructor(private servicecomptandf : ServicecomptandfComponent, private login : LoginComponent) {
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

  transformStatut(statut : string) {
    if(statut == 'noCds' || statut == 'noF' || statut == 'val'
    || statut == 'attCds' || statut == 'attF' || statut == 'noSent')
      return 'Validée'
    if(statut == 'avnoF')
      return 'Refus de laCompta'
    if(statut == 'avattF')
      return 'En attente de la Compta'
    return 'unknown'
  }

  refuserAvance(id : number) {
    this.servicecomptandf.refuserAvance(id);
  }

  accepterAvance(element : ILignedefrais) {
    this.servicecomptandf.accepterAvance(element);
  }


}
