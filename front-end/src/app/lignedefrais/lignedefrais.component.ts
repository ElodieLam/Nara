import { Component, OnInit, SimpleChange, SimpleChanges, OnChanges, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { LignedefraisService } from './lignedefrais.service';
import { ActivatedRoute } from '@angular/router';
import { ILignedefraisFull, ILignedefrais, ILignedefraisShort } from './lignedefrais.interface';
import { FormControl, Validators } from '@angular/forms';

export interface Mission {
  value: string;
  viewValue: string;
}
export interface Libelle {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-lignedefrais',
  templateUrl: './lignedefrais.component.html',
  styleUrls: ['./lignedefrais.component.css']
})
export class LignedefraisComponent implements OnInit, OnChanges {
 
  miss: Mission[] = [
    {value: 'thales-0', viewValue: 'Thales'},
    {value: 'amazon-1', viewValue: 'Amazon'},
    {value: 'mbda-2', viewValue: 'Mbda'}
  ];
  lib: Libelle[] = [
    {value: 'taxi-0', viewValue: 'Taxi'},
    {value: 'restaurant-1', viewValue: 'Restaurant'},
    {value: 'hotel-2', viewValue: 'Hotel'},
    {value: 'fourniture-3', viewValue: 'Fourniture'},
    {value: 'essence-4', viewValue: 'Essence'},
    {value: 'autre-5', viewValue: 'Autre'}
  ];
  componentData : any = {
    missions : this.miss,
    libelles : this.lib,
    mission : '',
    libelle : '',
    montant : ''
  }
  ldf : ILignedefraisShort;
  id_ndf: number = 0;
  
  private _id_ndf: number;
  private sub: any;
  listlignedefraisfull : ILignedefraisFull[];
  listlignedefrais : ILignedefrais[] = [];
  listAvance : Number[] = [];
  dataSource;
  displayedColumns: string[] = ['avance', 'status', 'mission', 'date',
  'libelle', 'montant', 'commentaire', 'justificatif', 'modifier', 'supprimer'];
  displayedColumnsold: string[] = ['id_ldf', 'id_ndf', 'nom_mission', 'libelle_ldf', 'montant_ldf',
  'date_ldf', 'status_ldf', 'commentaire_ldf', 'motif_refus', 'justif_ldf', 'mission_passe',
  'montant_estime', 'montant_avance'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private lignedefraisService : LignedefraisService, private route : ActivatedRoute,
    private dialog: MatDialog) { }
  
  ngOnInit() {
    console.log('init')
    this.sub = this.route.params.subscribe(params => {
      this.id_ndf = +params['id'];
    });
    this.lignedefraisService
      .getLignesdefraisFromIdNdf(this.id_ndf.toString())
      .subscribe( (data : ILignedefraisFull[]) => {
        console.log('query')
        this.listlignedefraisfull = data;
        
        this.listlignedefraisfull.forEach( ldf => {
          this.listlignedefrais.push(
            { 'id_ldf' : ldf.id_ldf, 'avance' : (ldf.montant_avance == null) ? false : true,
              'montant_avance' : ldf.montant_avance, 'status' : ldf.status_ldf, 
              'mission' : ldf.nom_mission, 'date' : ldf.date_ldf, 
              'libelle' : ldf.libelle_ldf, 'montant' : ldf.montant_ldf, 
              'commentaire' : ldf.commentaire_ldf, 'justificatif' : ldf.justif_ldf})
        });
        this.dataSource = new MatTableDataSource<ILignedefrais>(this.listlignedefrais);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    const id: SimpleChange = changes.id_ndf;
    this._id_ndf = id.currentValue.toUpperCase();
  }

  isAvance(ldf: ILignedefrais) {
    return ldf.avance;
  }

  onCheck(ldf : ILignedefrais) {
    var idx = this.listAvance.indexOf(ldf.id_ldf);
    (idx != -1) ? this.listAvance.splice(idx, 1) : this.listAvance.push(ldf.id_ldf);
  }

  openDialog() {
    console.log("here")
    const dialogRef = this.dialog.open(DialogNouvelleLignedefrais, {
      data: { comp : this.componentData }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
       this.ldf = result;
    });
  }

  temp(){
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-nouvelle-lignedefrais.html',
  styleUrls: ['./lignedefrais.component.css']
})
export class DialogNouvelleLignedefrais {

  montantControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^\\d+(\.\\d{1,2})?$')
  ]);
  missionControl = new FormControl('', [Validators.required]);
  libelleControl = new FormControl('', [Validators.required]);

  setValue() { this.montantControl.setValue('new value'); }

  constructor(
    public dialogRef: MatDialogRef<DialogNouvelleLignedefrais>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
    
  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close();
  }
}

