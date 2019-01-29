import { Component, OnInit, SimpleChange, SimpleChanges, OnChanges, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { LignedefraisService } from './lignedefrais.service';
import { ActivatedRoute } from '@angular/router';
import { ILignedefraisFull, ILignedefrais, ILignedefraisDialog, ILignedefraisToSend } from './lignedefrais.interface';
import { FormControl, Validators, FormGroup } from '@angular/forms';


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
 
  

  status : any[] = [
    {key: 'avnoSent', value : 'Avance non envoyée'},
    {key: 'avattCds', value : 'Avance attente CDS'},
    {key: 'avattF', value : 'Avance attente Compta'},
    {key: 'avnoCds', value : 'Avance refusée CDS'},
    {key: 'avnoF', value : 'Avance refusée Compta'},
    {key: 'noSent', value : 'Non envoyée'},
    {key: 'attCds', value : 'Attente CDS'},
    {key: 'attF', value : 'Attente Compta'},
    {key: 'noCds', value : 'Refusée CDS'},
    {key: 'noF', value : 'Refusée Compta'},
    {key: 'val', value : 'Validée'}

  ];

  componentData : any = {
    id_collab : 6,
    id_mission : '',
    libelle : '',
    montant : '',
    commentaire : '' 
  }
  ldf : ILignedefraisDialog;
  id_ndf: number = 0;
  id_collab: number = 6;
  
  private _id_ndf: number;
  private sub: any;
  listlignedefraisfull : ILignedefraisFull[];
  listlignedefrais : ILignedefrais[] = [];
  listAvance : Number[] = [];
  dataSource;
  displayedColumns: string[] = ['avance', 'status', 'mission', 'date',
  'libelle', 'montant', 'commentaire', 'justificatif', 'modifier', 'supprimer'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private lignedefraisService : LignedefraisService, private route : ActivatedRoute,
    private dialog: MatDialog) { }
  
  ngOnInit() {
    console.log('init')
    this.sub = this.route.params.subscribe(params => {
      this.id_ndf = +params['id'];
    });
    this.refreshLignesdefrais();
  }
  
  refreshLignesdefrais(){
    this.lignedefraisService
      .getLignesdefraisFromIdNdf({id : this.id_ndf.toString()})
      .subscribe( (data : ILignedefraisFull[]) => {
        console.log('query')
        this.listlignedefraisfull = data;
        
        this.listlignedefraisfull.forEach( ldf => {
          this.listlignedefrais.push(
            { 'id_ldf' : ldf.id_ldf, 'avance' : (ldf.montant_avance == null) ? false : true,
              'montant_avance' : ldf.montant_avance, 'status' : this.transformStatus(ldf.status_ldf), 
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
    this.componentData.id_mission = '';
    this.componentData.libelle = '';
    this.componentData.montant = '';
    this.componentData.commentaire = '';
    const dialogRef = this.dialog.open(DialogNouvelleLignedefrais, {
      data: { comp : this.componentData }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ldf = result;
      if(this.ldf != undefined){
        var lignedefrais = {
          id_ndf : this.id_ndf,
          id_mission : this.componentData.id_mission,
          libelle : this.componentData.libelle,
          montant : this.componentData.montant,
          commentaire : this.componentData.commentaire
        }
        this.lignedefraisService.createLignedefrais(lignedefrais);
        //this.refreshLignesdefrais();
      }
    });
  }

  temp(){
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  transformStatus(status : String) : String {
    for(var i = 0; i < this.status.length ; i ++){
      if(this.status[i].key == status)
        return this.status[i].value;
    }
    return 'statut undefined'
  }

}

export interface IMission { 
  id_mission : number;
  nom_mission : string 
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-nouvelle-lignedefrais.html',
  styleUrls: ['./lignedefrais.component.css']
})
export class DialogNouvelleLignedefrais implements OnInit{

  myGroup = new FormGroup({
    montantControl : new FormControl('', [
      Validators.required,
      Validators.pattern('^\\d+(\.\\d{1,2})?$')
    ])
  });
  missionControl = new FormControl('', [Validators.required]);
  libelleControl = new FormControl('', [Validators.required]);

  //TODO change
  libelles: Libelle[] = [
    {value: 'taxi-0', viewValue: 'Taxi'},
    {value: 'restaurant-1', viewValue: 'Restaurant'},
    {value: 'hotel-2', viewValue: 'Hotel'},
    {value: 'fourniture-3', viewValue: 'Fourniture'},
    {value: 'essence-4', viewValue: 'Essence'},
    {value: 'autre-5', viewValue: 'Autre'}
  ];

  missions : IMission[] ;
  
  constructor(
    public dialogRef: MatDialogRef<DialogNouvelleLignedefrais>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lignedefraisService : LignedefraisService) {}
   
  ngOnInit() {
    this.lignedefraisService
      .getMissionsFromIdCollab({id : this.data.comp.id_collab.toString()})
      .subscribe( (data : IMission[]) => {
        console.log(data);
        this.missions = data;
       });
  }

  onClick(): void {
    console.log("onclick");
    this.data.comp.montant =  this.myGroup.get('montantControl').value;
  }
  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close();
  }
}

