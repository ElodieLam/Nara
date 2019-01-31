import { Component, OnInit, SimpleChange, SimpleChanges, OnChanges, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MAT_SNACK_BAR_DATA} from '@angular/material';
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

  ldf : ILignedefraisDialog;
  id_ndf: number = 0;
  id_collab: number = 6;
  
  componentData : any = {
    id_ndf : 0,
    id_collab : 6,
    id_mission : '',
    libelle : '',
    montant : '',
    commentaire : '',
    valide : false 
  }

  private _id_ndf: number;
  private sub: any;
  listlignedefraisfull : ILignedefraisFull[] = [];
  listlignedefrais : ILignedefrais[] = [];
  listAvance : Number[] = [];
  dataSource;
  displayedColumns: string[] = ['avance', 'status', 'mission', 'date',
  'libelle', 'montant', 'commentaire', 'justificatif', 'modifier', 'supprimer'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private lignedefraisService : LignedefraisService, private route : ActivatedRoute,
    private dialog: MatDialog, private snackBar: MatSnackBar) { }
  
  ngOnInit() {
    console.log('init')
    this.sub = this.route.params.subscribe(params => {
      this.id_ndf = +params['id'];
      this.componentData.id_ndf = this.id_ndf;
    });
    this.refreshLignesdefrais();
  }
  
  refreshLignesdefrais(){
    // vide la liste affichee dans le tableau 
    this.listlignedefrais = [];    
    // requete SQL pour avoir toutes les lignes de frais de la note de frais
    this.lignedefraisService
      .getLignesdefraisFromIdNdf({id : this.id_ndf.toString()})
      .subscribe( (data : ILignedefraisFull[]) => {
        console.log('query')
        this.listlignedefraisfull = data;
        // transformation de la liste pour afficher les informations dans le tableau
        this.listlignedefraisfull.forEach( ldf => {
          this.listlignedefrais.push(
            { 'id_ldf' : ldf.id_ldf, 'avance' : (ldf.montant_avance == null) ? false : true,
              'montant_avance' : ldf.montant_avance, 'status' : this.transformStatus(ldf.status_ldf), 
              'mission' : ldf.nom_mission, 'date' : ldf.date_ldf, 
              'libelle' : ldf.libelle_ldf, 'montant' : ldf.montant_ldf, 
              'commentaire' : ldf.commentaire_ldf, 'justificatif' : ldf.justif_ldf})
        });
        // creation du tableau avec les options sort et paginator
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
    this.componentData.id_mission = '';
    this.componentData.libelle = '';
    this.componentData.montant = '';
    this.componentData.commentaire = '';
    this.componentData.valide = false;
    const dialogRef = this.dialog.open(DialogNouvelleLignedefrais, {
      data: { comp : this.componentData }
    });
    dialogRef.afterClosed().subscribe(result => {
      var temp = result;
      if(temp){
        if(temp.comp.valide) {
          console.log('temp')
          console.log(temp.comp.valide)
          this.delay(1500).then(any => {
            this.refreshLignesdefrais();
            this.openSnackBar('Ligne de frais ajoutée')
          });
        }
      }
    });
  }

  temp(){
  }

  supprLignedefrais(id_ldf : any) {
    console.log("wtf")
    console.log(id_ldf);
    this.lignedefraisService.deleteLignedefrais({id : id_ldf});
    this.delay(1500).then(any => {
      this.refreshLignesdefrais();
      this.openSnackBar('Ligne de frais supprimée');
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
}

  transformStatus(status : String) : String {
    for(var i = 0; i < this.status.length ; i ++){
      if(this.status[i].key == status)
        return this.status[i].value;
    }
    return 'statut undefined'
  }

  openSnackBar(msg: string) {
    console.log('snack')
    this.snackBar.openFromComponent(LignedefraisAjoutComponent, {
      duration: 750,
      data : msg
    });
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

  // myGroup = new FormGroup({
  //   montantControl : new FormControl('', [
  //     Validators.required,
  //     Validators.pattern('^\\d+(\.\\d{1,2})?$')
  //   ])
  // });
  myGroup = new FormGroup({
  });
  
  montantControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^\\d+(\.\\d{1,2})?$')
  ]);
  getErrorMessage() {
    return this.montantControl.hasError('required') ? 'Montant manquant' :
        this.montantControl.hasError('pattern') ? 'Montant invalide' : '';
  }
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

  missions : IMission[];
  _ldfValide : boolean = false;
  
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
    //this.data.comp.montant =  this.myGroup.get('montantControl').value;
    this.data.comp.montant =  this.montantControl.value;
    // verification de la validité de la note de frais 
    // avec les champs missions, libellé et montant
    if(this._ldfValide) {
      console.log('valid ldf')
      this.data.comp.valide = true;
      // query SQL pour l'ajout de la ligne de frais
      this.lignedefraisService.createLignedefrais({
        id_ndf : this.data.comp.id_ndf,
        id_mission : this.data.comp.id_mission,
        libelle : this.data.comp.libelle,
        montant : this.data.comp.montant,
        commentaire : this.data.comp.commentaire
      });
    }
    else {
      this.data.comp.valide = false;
      console.log('refus ldf')

    }
  }

  ldfValide() {
    // console.log("id " + this.data.comp.id_mission)
    // console.log("li " + this.data.comp.libelle)
    // console.log("mo " + this.montantControl.value);
    this._ldfValide = this.data.comp.id_mission != '' && this.data.comp.libelle != '' && this.montantValid(this.montantControl.value);
    return this._ldfValide;
  }

  onChange(value : any) {
    // console.log('value changed')
    // console.log(this.ldfValide());
    this.ldfValide();
  }

  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close();
  }

  montantValid(montant : String) : boolean {
    return (montant != '') && (montant.match('\\d+(\.\\d{1,2})?')[0] == montant);
  }
}

@Component({
  selector: 'snack-bar-component-ajout',
  templateUrl: 'snack-bar-component-ajout.html',
  styles: [`
    .ajout-ligne-de-frais {
      text-align: center;
    }
  `],
})
export class LignedefraisAjoutComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
