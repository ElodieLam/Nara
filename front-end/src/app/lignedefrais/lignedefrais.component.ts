import { Component, OnInit, SimpleChange, SimpleChanges, OnChanges, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar, MAT_SNACK_BAR_DATA} from '@angular/material';
import { LignedefraisService } from './lignedefrais.service';
import { ActivatedRoute } from '@angular/router';
import { ILignedefraisFull, ILignedefrais, IAvance, ILignedefraisShort, IAvanceShort } from './lignedefrais.interface';
import { DatePipe } from '@angular/common';

import { DialogEnvoyerAvance } from './dialog-envoyer-avance.component';
import { DialogEnvoyerLignes } from './dialog-envoyer-lignes.component';
import { DialogModifierAvance } from './dialog-modifier-avance.component';
import { DialogModifierLignedefrais } from './dialog-modifier-lignedefrais.component';
import { DialogNouvelleLignedefrais } from './dialog-nouvelle-lignedefrais.component';
import { LoginComponent } from '../login/login.component'
import * as CryptoJS from 'crypto-js'; 

@Component({
  selector: 'app-lignedefrais',
  templateUrl: './lignedefrais.component.html',
  styleUrls: ['./lignedefrais.component.css'],
  providers: [DatePipe]
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
  annee: number = 0;
  mois: number = 0;
  id_collab: number = 0;
  montantTotal: number = 0.00;
  
  componentData : any = {
    id_ldf : 0,
    id_ndf : 0,
    id_collab : 0,
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
  currentNdf:boolean = false;
  displayedColumns: string[] = ['avance', 'status', 'mission', 'date',
  'libelle', 'montant', 'commentaire', 'justificatif', 'modifier', 'supprimer'];
  listemois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  isDisabled: boolean = true;
  cntAvance: number = 0;
  cntLdf: number = 0;
  //Variable pour encrypt/decrypt
  keySize: number = 256;
  ivSize : number = 128;
  iterations : number = 100;
  key  : any = "daouda";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private lignedefraisService : LignedefraisService, private route : ActivatedRoute,
    private dialog: MatDialog, private snackBar: MatSnackBar, private datePipe: DatePipe,
    private login: LoginComponent) {
      this.id_collab = login.user.id_collab;
     }
  
  ngOnInit() {
    //console.log('init')
    this.sub = this.route.params.subscribe(params => {

      
      var decrypted = this.decrypt(params['id'], this.key);
      console.log("Param decrypted: " + decrypted.toString(CryptoJS.enc.Utf8));
      var str = decrypted.toString(CryptoJS.enc.Utf8).split("-",3);
      
      this.id_ndf = +str[0]
      this.annee = +str[1];
      this.mois = +str[2];
      var stri = this.datePipe.transform(new Date(), 'yyyy-MM-dd').split("-",2);
      console.log(this.annee + ' ' + this.mois)
      console.log(+stri[0] + ' ' + +stri[1])
      if(+stri[0] == this.annee && +stri[1] == this.mois) {
        this.currentNdf = true;
      }
      this.componentData.id_ndf = this.id_ndf;
    });
    this.refreshLignesdefrais();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  refreshLignesdefrais(){
    this.montantTotal = 0;
    this.cntLdf = 0;
    this.cntAvance = 0;
    // vide la liste affichee dans le tableau 
    this.listlignedefrais = [];    
    // requete SQL pour avoir toutes les lignes de frais de la note de frais
    this.lignedefraisService
      .getLignesdefraisFromIdNdf({id : this.id_ndf.toString()})
      .subscribe( (data : ILignedefraisFull[]) => {
        this.listlignedefraisfull = data;
        // transformation de la liste pour afficher les informations dans le tableau
        this.listlignedefraisfull.forEach( ldf => {
          if(ldf.statut_ldf == 'avnoSent')
            this.cntAvance += 1;
          if(ldf.statut_ldf == 'noSent')
            this.cntLdf += 1;
          this.listlignedefrais.push(
            { 'id_ldf' : ldf.id_ldf, 'avance' : (ldf.montant_avance == null) ? false : true,
              'montant_avance' : ldf.montant_avance, 'status' : this.transformStatus(ldf.statut_ldf), 
              'id_mission' : ldf.id_mission, 'id_chef' : ldf.id_chef, 'mission' : ldf.nom_mission, 
              'id_ndf' : ldf.id_ndf, 'date' : ldf.date_ldf, 'libelle' : ldf.libelle_ldf, 
              'montant_estime' : ldf.montant_estime, 'montant' : ldf.montant_ldf, 
              'commentaire' : ldf.commentaire_ldf, 'commentaire_refus' : ldf.motif_refus, 
              'justificatif' : ldf.justif_ldf, 'date_mission' : ldf.date_mission})
          //console.log(ldf.montant_avance + ' ' + ldf.montant_ldf)
          this.montantTotal += +ldf.montant_ldf - ((ldf.montant_avance == null) ? 0 : +ldf.montant_avance);
          //console.log(this.montantTotal)
        });
        // creation du tableau avec les options sort et paginator
        this.dataSource = new MatTableDataSource<ILignedefrais>(this.listlignedefrais);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isDisabled = false;
    });
    
  }

  ngOnChanges(changes: SimpleChanges) {
    const id: SimpleChange = changes.id_ndf;
    this._id_ndf = id.currentValue.toUpperCase();
  }

  isAvance(ldf: ILignedefrais) {
    return ldf.avance;
  }

  isCheckable(statut : any) {
    if(statut == 'Non envoyée')
      return true;
    return false;
  }

  onCheck(ldf : ILignedefrais) {
    var idx = this.listAvance.indexOf(ldf.id_ldf);
    (idx != -1) ? this.listAvance.splice(idx, 1) : this.listAvance.push(ldf.id_ldf);
  }

  openDialogNouvelleLignedefrais() {
    this.componentData.id_ldf = 0;
    this.componentData.id_mission = '';
    this.componentData.id_collab = this.id_collab;
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
    this.componentData.id_collab = this.id_collab;
    this.componentData.nom_mission = element.mission;
    this.componentData.libelle = element.libelle;
    this.componentData.montant = element.montant;
    this.componentData.commentaire = element.commentaire;
    this.componentData.commentaire_refus = element.commentaire_refus;
    this.componentData.valide = false;
    const dialogRef = this.dialog.open(DialogModifierLignedefrais, {
      data: { comp : this.componentData , stat : element.status, 
        avance : element.avance, montant_avance : element.montant_avance
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      var temp = result;
      if(temp){
        if(temp.comp.valide) {
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
    this.componentData.id_collab = this.id_collab;
    this.componentData.nom_mission = element.mission;
    this.componentData.libelle = element.libelle;
    this.componentData.montant = element.montant;
    this.componentData.montant_avance = element.montant_avance;
    this.componentData.montant_estime = element.montant_estime;
    this.componentData.commentaire = element.commentaire;
    this.componentData.commentaire_refus = element.commentaire_refus;
    this.componentData.valide = false;
    const dialogRef = this.dialog.open(DialogModifierAvance, {
      data: { comp : this.componentData , stat : element.status, 
        avance : element.avance
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      var temp = result;
      if(temp){
        if(temp.comp.valide) {
          this.delay(1500).then(any => {
            this.refreshLignesdefrais();
            this.openSnackBar('Avance modifiée')
          });
        }
      }
    });
  }


  openDialogEnvoyerAvance() {
    var listAvance : IAvanceShort[] = [];
    this.listlignedefrais.forEach(element => {
      if(element.status == 'Avance non envoyée') {
        listAvance.push({
          'id_ndf' : element.id_ndf,
          'id_ldf' : element.id_ldf,
          'id_chef' : element.id_chef,
          'nom_mission' : element.mission,
          'libelle' : element.libelle,
          'montant_estime' : element.montant_estime,
          'montant_avance' : element.montant_avance
        });
      }
    });
    if(listAvance.length != 0) {
      const dialogRef = this.dialog.open(DialogEnvoyerAvance, {
        data: { liste : listAvance, id_collab : this.id_collab  }
      });
      dialogRef.afterClosed().subscribe(result => {
        var temp = result;
        if(temp) {
          this.delay(1500).then(any => {
            this.refreshLignesdefrais();
            this.openSnackBar('Avances créés et envoyées');
          });
        }
      });
    }
    else {
      this.openSnackBar('Aucune avance à envoyer')
    }
  }

  openDialogEnvoyerLignes() {
    var avance = false;
    var listLdf : ILignedefraisShort[] = [];
    this.listlignedefrais.forEach( ligne => {
      if(ligne.avance && ligne.status == 'Non envoyée') {
        if((new Date(ligne.date_mission.toString()) > new Date()) ? false : true) {
          listLdf.push({ 
            'id_ldf' : ligne.id_ldf,
            'id_ndf' : ligne.id_ndf,
            'id_mission' : ligne.id_mission,
            'id_chef' : ligne.id_chef,
            'nom_mission' : ligne.mission, 
            'libelle' : ligne.libelle, 
            'avance' : ligne.avance,
            'montant' : ligne.montant//,
            //'apres_mission' : (new Date(ligne.date_mission.toString()) > new Date()) ? false : true
          })
        }
      }
      else if(!ligne.avance && ligne.status == 'Non envoyée' && ligne.montant != 0)
        listLdf.push({ 
              'id_ldf' : ligne.id_ldf,
              'id_ndf' : ligne.id_ndf,
              'id_mission' : ligne.id_mission,
              'id_chef' : ligne.id_chef,
              'nom_mission' : ligne.mission, 
              'libelle' : ligne.libelle, 
              'avance' : ligne.avance,
              'montant' : ligne.montant//,
              //'apres_mission' : (new Date(ligne.date_mission.toString()) > new Date()) ? false : true
            })
        
      });
      console.log(listLdf);
    if(listLdf.length > 0) {
      const dialogRef = this.dialog.open(DialogEnvoyerLignes, {
        data: { liste : listLdf, id_collab : this.id_collab }
      });
      dialogRef.afterClosed().subscribe(result => {
        var temp = result;
        if(temp) {
          this.delay(3000).then(any => {
            this.refreshLignesdefrais();
            this.openSnackBar('Lignes envoyées');
          });
        }
      });
    }
    else {
      this.openSnackBar('Aucune lignes à envoyer');
    }
    }
  

  temp(){
  }

  supprLignedefrais(ldf : ILignedefrais) {
    this.isDisabled = true;
    if(ldf.avance) {
      this.lignedefraisService.deleteAvance({id : ldf.id_ldf});
      this.delay(1500).then(any => {
        this.refreshLignesdefrais();
        this.openSnackBar('Avance supprimée');
      });
    }
    else {
      this.lignedefraisService.deleteLignedefrais({id : ldf.id_ldf});
      this.delay(1500).then(any => {
        this.refreshLignesdefrais();
        this.openSnackBar('Ligne de frais supprimée');
      });
    }
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

  encrypt (msg, key) {
    var salt = CryptoJS.lib.WordArray.random(128/8);
    var key = CryptoJS.PBKDF2(key, salt, {
        keySize: this.keySize/32,
        iterations: this.iterations
      });
    var iv = CryptoJS.lib.WordArray.random(128/8);
    var encrypted = CryptoJS.AES.encrypt(msg, key, { 
      iv: iv, 
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC

    });
    var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
    return transitmessage;
  }


  decrypt (transitmessage, key) {
    var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
    var encrypted = transitmessage.substring(64);

    var key = CryptoJS.PBKDF2(key, salt, {
      keySize: this.keySize/32,
      iterations: this.iterations
    });

    var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
      iv: iv, 
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC  
    })
    return decrypted;
  }
}

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
