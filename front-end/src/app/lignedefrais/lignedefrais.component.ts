import { Component, OnInit, SimpleChange, SimpleChanges, OnChanges, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MAT_SNACK_BAR_DATA} from '@angular/material';
import { LignedefraisService } from './lignedefrais.service';
import { ActivatedRoute } from '@angular/router';
import { ILignedefraisFull, ILignedefrais } from './lignedefrais.interface';
import { FormControl, Validators, FormGroup } from '@angular/forms';

export interface Libelle {
  value: string;
}

export interface Avance {
  id_ldf: Number;
  id_mission: Number;
  nom_mission: String;
  libelle: String;
  montant_estime: Number;
  montant_avance: Number;
  commentaire: String;
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

  id_ndf: number = 0;
  id_collab: number = 6;
  
  componentData : any = {
    id_ldf : 0,
    id_ndf : 0,
    id_collab : 6,
    id_mission : '',
    nom_mission : '',
    libelle : '',
    montant : '',
    montant_estime : '',
    montant_avance : '',
    commentaire : '',
    commentaire_refus : '',
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
              'id_mission' : ldf.id_mission, 'mission' : ldf.nom_mission, 
              'date' : ldf.date_ldf, 'libelle' : ldf.libelle_ldf, 'montant_estime' : ldf.montant_estime,
              'montant' : ldf.montant_ldf, 'commentaire' : ldf.commentaire_ldf, 
              'commentaire_refus' : ldf.motif_refus, 'justificatif' : ldf.justif_ldf})
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

  openDialogNouvelleLignedefrais() {
    this.componentData.id_ldf = 0;
    this.componentData.id_mission = '';
    this.componentData.nom_mission = '';
    this.componentData.libelle = '';
    this.componentData.montant = '';
    this.componentData.commentaire = '';
    this.componentData.commentaire_refus = '';
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

  openDialogModifierLignedefrais(element : ILignedefrais) {
    this.componentData.id_ldf = element.id_ldf;
    this.componentData.id_mission = element.id_mission;
    this.componentData.nom_mission = element.mission;
    this.componentData.libelle = element.libelle;
    this.componentData.montant = element.montant;
    this.componentData.commentaire = element.commentaire;
    this.componentData.commentaire_refus = element.commentaire_refus;
    this.componentData.valide = false;
    console.log(element);
    const dialogRef = this.dialog.open(DialogModifierLignedefrais, {
      data: { comp : this.componentData , stat : element.status, 
        avance : element.avance, montant_avance : element.montant_avance}
    });
    dialogRef.afterClosed().subscribe(result => {
      var temp = result;
      console.log('temp');
      if(temp){
        if(temp.comp.valide) {
          console.log('temp')
          console.log(temp.comp.valide)
          this.delay(1500).then(any => {
            this.refreshLignesdefrais();
            this.openSnackBar('Ligne de frais modifiée')
          });
        }
      }
    });
  }

  openDialogModifierAvance(element : ILignedefrais) {
    this.componentData.id_ldf = element.id_ldf;
    this.componentData.id_mission = element.id_mission;
    this.componentData.nom_mission = element.mission;
    this.componentData.libelle = element.libelle;
    this.componentData.montant = element.montant;
    this.componentData.montant_avance = element.montant_avance;
    this.componentData.montant_estime = element.montant_estime;
    this.componentData.commentaire = element.commentaire;
    this.componentData.commentaire_refus = element.commentaire_refus;
    this.componentData.valide = false;
    console.log(element);
    const dialogRef = this.dialog.open(DialogModifierAvance, {
      data: { comp : this.componentData , stat : element.status, 
        avance : element.avance}
    });
    dialogRef.afterClosed().subscribe(result => {
      var temp = result;
      console.log('temp');
      if(temp){
        if(temp.comp.valide) {
          console.log('temp')
          console.log(temp.comp.valide)
          this.delay(1500).then(any => {
            this.refreshLignesdefrais();
            this.openSnackBar('Avance modifiée')
          });
        }
      }
    });
  }


  openDialogEnvoyerAvance() {
    if(this.listAvance.length > 0) {
      var listLdf : Avance[] = [];
      this.listAvance.forEach( num => {
        for(var i = 0 ; i < this.listlignedefrais.length ; ++i) {
          if(this.listlignedefrais[i].id_ldf == num)
            listLdf.push({ 'id_ldf' : this.listlignedefrais[i].id_ldf,
              'id_mission' : this.listlignedefrais[i].id_mission,
              'nom_mission' : this.listlignedefrais[i].mission, 
              'libelle' : this.listlignedefrais[i].libelle, 
              'montant_estime' : this.listlignedefrais[i].montant, 
              'montant_avance' : this.listlignedefrais[i].montant, 
              'commentaire' : this.listlignedefrais[i].commentaire})
        }
      });
      const dialogRef = this.dialog.open(DialogEnvoyerAvance, {
        data: { liste : listLdf }
      });
      dialogRef.afterClosed().subscribe(result => {
        var temp = result;
      });
    }
    else {
      this.openSnackBar('Aucune ligne de frais séléctionnée')
    }
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

  modifPossible(ldf : ILignedefrais) : boolean {
    if( (!ldf.avance &&
      ldf.status == 'Attente Compta' ||
      ldf.status == 'Validée' ) ||
      (ldf.avance && (
        ldf.status == 'Avance attente Compta' ||
        ldf.status == 'Attente Compta' ||
        ldf.status == 'Validée' )
        ) )
        return false;
    return true;
  }

  supprPossible(ldf : ILignedefrais) : boolean{
    if( (!ldf.avance &&
      ldf.status == 'Validée' ) ||
      (ldf.avance && (
        ldf.status == 'Non envoyée' ||
        ldf.status == 'Attente CDS' ||
        ldf.status == 'Attente Compta' ||
        ldf.status == 'Refusée CDS' ||
        ldf.status == 'Refusée Compta' ||
        ldf.status == 'Validée' )
        ) )
        return false;
    return true;
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

// ###############################################################
// ###############################################################
// ###############################################################
// ###############################################################
// ###############################################################

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-nouvelle-lignedefrais.html',
  styleUrls: ['./lignedefrais.component.css']
})
export class DialogNouvelleLignedefrais implements OnInit{

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

  libelles: Libelle[] = [
    {value: 'Taxi'},
    {value: 'Restaurant'},
    {value: 'Hotel'},
    {value: 'Fourniture'},
    {value: 'Essence'},
    {value: 'Autre'}
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

  onChange(value : any) {
    if(this.montantControl.value)
      this._ldfValide = this.data.comp.id_mission != '' && this.data.comp.libelle != '' && this.montantValid(this.montantControl.value);
    else
      this._ldfValide = false;
  }
  
  montantValid(montant : String) : boolean {
    return (montant != '') && (montant.match('\\d+(\.\\d{1,2})?')[0] == montant);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// ###############################################################
// ###############################################################
// ###############################################################
// ###############################################################
// ###############################################################

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-modifier-lignedefrais.html',
  styleUrls: ['./lignedefrais.component.css']
})
export class DialogModifierLignedefrais implements OnInit{

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

  libelles: Libelle[] = [
    {value: 'Taxi'},
    {value: 'Restaurant'},
    {value: 'Hotel'},
    {value: 'Fourniture'},
    {value: 'Essence'},
    {value: 'Autre'}
  ];

  missions : IMission[];
  _missModif : boolean = false;
  _libModif : boolean = true;
  _ldfValide : boolean = false;
  _refusCDS :boolean = false;
  _refusCompta :boolean = false;
  _modif : boolean = false;

  valuesAtStart : any = {
    id_mission : 0,
    libelle : '',
    montant : 0,
    commentaire : ''
  }
  
  constructor(
    public dialogRef: MatDialogRef<DialogNouvelleLignedefrais>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lignedefraisService : LignedefraisService) {}
   
  ngOnInit() {
    this.montantControl.setValue(this.data.comp.montant);
    // valeurs pour la comparaison pour activer le bouton modifier
    this.valuesAtStart = {id_mission : this.data.comp.id_mission,
      libelle : this.data.comp.libelle, montant : this.data.comp.montant,
      commentaire : this.data.comp.commentaire };
    // init pour savoir si on affichera le motif de refus dans le dialog
    if(this.data.stat == 'Refusée CDS')
      this._refusCDS = true;
    if(this.data.stat == 'Refusée Compta')
      this._refusCompta = true;
    // cas ou la mission est modifiable
    if(this.data.stat == 'Non envoyée') {
        this.lignedefraisService
        .getMissionsFromIdCollab({id : this.data.comp.id_collab.toString()})
        .subscribe( (data : IMission[]) => {
          this._missModif = true;
          this.missions = data;
        });
    }
  }

  onClick(): void {
    this.data.comp.montant =  this.montantControl.value;
    console.log(this.data)
    // verification de la validité de la note de frais 
    // avec les champs missions, libellé et montant
    if(this._ldfValide) {
      console.log('valid ldf')
      this.data.comp.valide = true;
      // query SQL pour l'ajout de la ligne de frais
      this.lignedefraisService.updateLignedefrais({
        id_mission : this.data.comp.id_mission,
        id_ldf : this.data.comp.id_ldf,
        libelle : this.data.comp.libelle,
        montant : this.data.comp.montant,
        commentaire : this.data.comp.commentaire
      });
    }
  }

  onChange() {
    this._modif = (this.valuesAtStart.id_mission != this.data.comp.id_mission) || 
      (this.valuesAtStart.libelle != this.data.comp.libelle) || 
      (this.valuesAtStart.montant != this.montantControl.value) ||
      (this.valuesAtStart.commentaire != this.data.comp.commentaire);
    if(this.montantControl.value)
      this._ldfValide = this.data.comp.id_mission != '' && this.data.comp.libelle != '' && this.montantValid(this.montantControl.value);
    else
      this._ldfValide = false;
    return this._ldfValide && this._modif;

  }
  
  montantValid(montant : String) : boolean {
    console.log('check ' + montant);
    if(String(montant).match('\\d+(\.\\d{1,2})?'))
      return (montant != '') && (String(montant).match('\\d+(\.\\d{1,2})?')[0] == montant);
    else
      return false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// ###############################################################
// ###############################################################
// ###############################################################
// ###############################################################
// ###############################################################

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-modifier-avance.html',
  styleUrls: ['./lignedefrais.component.css']
})
export class DialogModifierAvance implements OnInit{

  myGroup = new FormGroup({
    montantControl : new FormControl('', [
      Validators.required,
      Validators.pattern('^\\d+(\.\\d{1,2})?$')
    ]),
    montantAvanceControl : new FormControl('', [
      Validators.required,
      Validators.pattern('^\\d+(\.\\d{1,2})?$')
    ]),
    montantEstimeControl : new FormControl('', [
      Validators.required,
      Validators.pattern('^\\d+(\.\\d{1,2})?$')
    ]),
    missionControl : new FormControl('', [Validators.required]),
    libelleControl : new FormControl('', [Validators.required])
  });
  getErrorMessage() {
    return this.myGroup.get('montantControl').hasError('required') ? 'Montant manquant' :
      this.myGroup.get('montantControl').hasError('pattern') ? 'Montant invalide' : '';
  }
  getErrorMessageAvance() {
    return this.myGroup.get('montantAvanceControl').hasError('required') ? 'Montant manquant' :
      this.myGroup.get('montantAvanceControl').hasError('pattern') ? 'Montant invalide' : '';
  }
  getErrorMessageEstime() {
    return this.myGroup.get('montantEstimeControl').hasError('required') ? 'Montant manquant' :
      this.myGroup.get('montantEstimeControl').hasError('pattern') ? 'Montant invalide' : '';
  }
  
  libelles: Libelle[] = [
    {value: 'Taxi'}, {value: 'Restaurant'}, {value: 'Hotel'}, 
    {value: 'Fourniture'},{value: 'Essence'}, {value: 'Autre'}
  ];

  missions : IMission[];
  _missModif : boolean = false;
  _libModif : boolean = true;
  _apresMiss : boolean = false;
  _ldfValide : boolean = false;
  _avance : boolean = false;
  _refusCDS :boolean = false;
  _refusCompta :boolean = false;
  _modif : boolean = false;

  valuesAtStart : any = {
    id_mission : 0,
    libelle : '',
    montant : '',
    commentaire : '',
    montant_estime : '',
    montant_avance : ''
  }
  
  constructor(
    public dialogRef: MatDialogRef<DialogNouvelleLignedefrais>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lignedefraisService : LignedefraisService) {}
   
  ngOnInit() {
    console.log('avance')
    // valeurs pour la comparaison pour activer le bouton modifier
    this.valuesAtStart = {id_mission : this.data.comp.id_mission,
      libelle : this.data.comp.libelle, montant : this.data.comp.montant,
      commentaire : this.data.comp.commentaire,
      montant_estime : this.data.comp.montant_estime,
      montant_avance : this.data.comp.montant_avance,
    };
    this.myGroup.get('montantAvanceControl').setValue(this.data.comp.montant_avance);
    this.myGroup.get('montantControl').setValue(this.data.comp.montant);
    this.myGroup.get('montantEstimeControl').setValue(this.data.comp.montant_estime);
    // init des valeurs si la ldf est une avance
    if(this.data.stat == 'Non envoyée' || 
        this.data.stat == 'Attente CDS' || 
        this.data.stat == 'Refusée CDS' || 
        this.data.stat == 'Refusée Compta') {
          this._apresMiss = true;
          this._libModif = false;
    } 
    // init pour savoir si on affichera le motif de refus dans le dialog
    if(this.data.stat == 'Refusée CDS' || this.data.stat == 'Avance refusée CDS' )
      this._refusCDS = true;
    if(this.data.stat == 'Refusée Compta' || this.data.stat == 'Avance refusée Compta' )
      this._refusCompta = true;
    // cas ou la mission est modifiable
    if(this._avance && this.data.stat == 'Avance non envoyée'){
        this.lignedefraisService
        .getMissionsFromIdCollab({id : this.data.comp.id_collab.toString()})
        .subscribe( (data : IMission[]) => {
          this._missModif = true;
          this.missions = data;
        });
    }
  }

  onClick(): void {
    this.data.comp.montant =  this.myGroup.get('montantControl').value;
    this.data.comp.montant_avance =  this.myGroup.get('montantAvanceControl').value;
    this.data.comp.montant_estime =  this.myGroup.get('montantEstimeControl').value;
    console.log(this.data)
    // verification de la validité de la note de frais 
    // avec les champs missions, libellé et montant
    if(this._ldfValide) {
      console.log('valid ldf')
      this.data.comp.valide = true;
      if(this._apresMiss) {
        console.log('apres mission')
        this.lignedefraisService.updateLignedefraisAvance({
          id_mission : this.data.comp.id_mission,
          id_ldf : this.data.comp.id_ldf,
          libelle : this.data.comp.libelle,
          montant : this.data.comp.montant,
          montant_avance : this.data.comp.montant_avance,
          montant_estime : this.data.comp.montant_estime,
          commentaire : this.data.comp.commentaire,
          status : 'noSent'
        });
      }
      else {
        console.log('avant mission')
        this.lignedefraisService.updateLignedefraisAvance({
          id_mission : this.data.comp.id_mission,
          id_ldf : this.data.comp.id_ldf,
          libelle : this.data.comp.libelle,
          montant : 0,
          montant_avance : this.data.comp.montant_avance,
          montant_estime : this.data.comp.montant_estime,
          commentaire : this.data.comp.commentaire,
          status : 'avnoSent'
        });
      }

    }
  }

  onChange() {
    this._modif = (this.valuesAtStart.id_mission != this.data.comp.id_mission) || 
      (this.valuesAtStart.libelle != this.data.comp.libelle) || 
      (this.valuesAtStart.montant != this.myGroup.get('montantControl').value) ||
      (this.valuesAtStart.montant_estime != this.myGroup.get('montantAvanceControl').value) ||
      (this.valuesAtStart.montant_avance != this.myGroup.get('montantEstimeControl').value) ||
      (this.valuesAtStart.commentaire != this.data.comp.commentaire);
    console.log('modif ' + this._modif)
    if(this.myGroup.get('montantControl').value && this._apresMiss)
      this._ldfValide  = this.montantValid(this.myGroup.get('montantControl').value);
    else if (this.myGroup.get('montantAvanceControl').value && this.myGroup.get('montantEstimeControl').value && !this._apresMiss)
      this._ldfValide = this.montantValid(this.myGroup.get('montantEstimeControl').value) &&
        this.montantValid(this.myGroup.get('montantAvanceControl').value) && 
        this.data.comp.id_mission != '' && this.data.comp.libelle != '';
    else
      this._ldfValide = false;
    console.log('valid ' + this._ldfValide)
    return this._ldfValide && this._modif;

  }
  
  montantValid(montant : String) : boolean {
    console.log('check ' + montant);
    if(String(montant).match('\\d+(\.\\d{1,2})?'))
      return (montant != '') && (String(montant).match('\\d+(\.\\d{1,2})?')[0] == montant);
    else
      return false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// ###############################################################
// ###############################################################
// ###############################################################
// ###############################################################
// ###############################################################

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-envoyer-avance.html',
  styleUrls: ['./lignedefrais.component.css']
})
export class DialogEnvoyerAvance implements OnInit{
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource;
  displayedColumns: string[] = ['mission', 'libelle', 'montant_estime', 'montant_avance'];
  _avanceValid:boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogNouvelleLignedefrais>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lignedefraisService : LignedefraisService) {}
   
  ngOnInit() {
    console.log(this.data)
    console.log('avance')
    this.dataSource = new MatTableDataSource<ILignedefrais>(this.data.liste);
    this.dataSource.paginator = this.paginator;
  }

  onClick(): void {
    // boucle d'ajout des notes d'avance, et suppr des ldf
  }

  onChange() {
    for(var i=0; i < this.data.liste.length; i++) {
      if(!this.montantValid(this.data.liste[i].montant_avance)) {
        this._avanceValid = false;
        break;
      }
      this._avanceValid = true;
    }
  }
  
  montantValid(montant : String) : boolean {
    if(String(montant).match('\\d+(\.\\d{1,2})?'))
      return (montant != '') && (String(montant).match('\\d+(\.\\d{1,2})?')[0] == montant);
    else
      return false;
  }

  temp()
  {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// ###############################################################
// ###############################################################
// ###############################################################
// ###############################################################
// ###############################################################

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
