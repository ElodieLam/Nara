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
import { DialogNouvelleAvance } from './dialog-nouvelle-avance.component';

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
  moisAnnee: string = '';
  id_collab: number = 0;
  montantTotalLdf: number = 0.0;
  heure: Date;
  
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
  listavance : ILignedefrais[] = [];
  dataSource;
  currentNdf:boolean = false;
  displayedColumns: string[] = ['status', 'mission', 'date',
  'libelle', 'avance', 'montant', 'commentaire', 'justificatif', 'modifier', 'supprimer'];
  
  listemois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  isDisabled: boolean = true;
  isOkToSend:boolean = true;
  isVoidable:boolean = true;
  sendabled:boolean = true;
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
      this.moisAnnee = this.listemois[this.mois] + ' ' + this.annee;
    });
    this.refreshLignesdefrais();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
  
  refreshLignesdefrais(){
    this.montantTotalLdf = 0;
    this.cntLdf = 0;
    this.cntAvance = 0;
    this.isOkToSend = false;
    this.sendabled = true;
    // vide la liste affichee dans le tableau 
    this.listlignedefrais = [];    
    this.listavance = [];    
    // requete SQL pour avoir toutes les lignes de frais et avances de la note de frais
    this.lignedefraisService
      .getLignesdefraisFromIdNdf({id : this.id_ndf.toString()})
      .subscribe( (data : ILignedefraisFull[]) => {
        this.listlignedefraisfull = data;
        // transformation de la liste pour afficher les informations dans le tableau
        this.listlignedefraisfull.forEach( ldf => {
          // cela permet de savoir si la note de frais peut être envoyée,
          // si il y a une ligne avec un "non" d'un chef de service, 
          // la note ne peut pas être envoyée
          if(this.sendabled)
            (ldf.statut_ldf == 'noCds') ? this.sendabled = false : {} ;
          // cela permet de savoir si l'envoi de la note de frais peut être annulable,
          // dans le cas où il y a des lignes en attente de la compta ou validée c'est impossible
          if(this.isVoidable){
            (ldf.statut_ldf == 'attF' || ldf.statut_ldf == 'val') ? this.isVoidable = false : {}
          }
          //ce n'est pas une avance donc on met la ligne dans les lignes de frais
          if(ldf.montant_avance == null ) {
            // on met a jour le montant total de la note de frais
            this.montantTotalLdf += +ldf.montant_ldf;
            this.listlignedefrais.push(
              { 'id_ldf' : ldf.id_ldf, 'avance' : false,
                'montant_avance' : ldf.montant_avance, 'status' : this.transformStatus(ldf.statut_ldf), 
                'id_mission' : ldf.id_mission, 'id_chef' : ldf.id_chef, 'mission' : ldf.nom_mission, 
                'id_ndf' : ldf.id_ndf, 'date' : ldf.date_ldf, 'libelle' : ldf.libelle_ldf, 
                'montant_estime' : ldf.montant_estime, 'montant' : ldf.montant_ldf, 
                'commentaire' : ldf.commentaire_ldf, 'commentaire_refus' : ldf.motif_refus, 
                'justificatif' : ldf.justif_ldf, 'date_mission' : ldf.date_mission})
          }
          //c'est une avance
          else {
            //c'est une demande d'avance, on la met dans la seconde liste
            if(ldf.statut_ldf == 'avnoSent' || ldf.statut_ldf == 'avattCds' ||
            ldf.statut_ldf == 'avattF' || ldf.statut_ldf == 'avnoCds' ||
            ldf.statut_ldf == 'avnoF' ) {
              // décalage pour obtenir les vraies dates
              // car on ne peut pas envoyer la note de frais 
              // TODO fix feature
              if(this.isOkToSend){
                var date = new Date(ldf.date_mission.toString())
                date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))
                var str = this.datePipe.transform(date, 'yyyy-MM-dd').split("-",2);
                if(+str[0] == this.annee && +str[1] == +this.mois)
                  this.isOkToSend = false;
              }
              // on ajoute la ligne dans les avances qui peuvent être envoyée
              this.listavance.push(
                { 'id_ldf' : ldf.id_ldf, 'avance' : true,
                  'montant_avance' : ldf.montant_avance, 'status' : this.transformStatus(ldf.statut_ldf), 
                  'id_mission' : ldf.id_mission, 'id_chef' : ldf.id_chef, 'mission' : ldf.nom_mission, 
                  'id_ndf' : ldf.id_ndf, 'date' : ldf.date_ldf, 'libelle' : ldf.libelle_ldf, 
                  'montant_estime' : ldf.montant_estime, 'montant' : ldf.montant_ldf, 
                  'commentaire' : ldf.commentaire_ldf, 'commentaire_refus' : ldf.motif_refus, 
                  'justificatif' : ldf.justif_ldf, 'date_mission' : ldf.date_mission})             
            }
            else {
              // on met à jour le montant de la note de frais
              this.montantTotalLdf += +ldf.montant_ldf;
              // on ajoute la ligne dans les avances mais avec le statut validée
              this.listavance.push(
                { 'id_ldf' : ldf.id_ldf, 'avance' : true,
                  'montant_avance' : ldf.montant_avance, 'status' : 'Validée', 
                  'id_mission' : ldf.id_mission, 'id_chef' : ldf.id_chef, 'mission' : ldf.nom_mission, 
                  'id_ndf' : ldf.id_ndf, 'date' : ldf.date_ldf, 'libelle' : ldf.libelle_ldf, 
                  'montant_estime' : ldf.montant_estime, 'montant' : ldf.montant_ldf, 
                  'commentaire' : ldf.commentaire_ldf, 'commentaire_refus' : ldf.motif_refus, 
                  'justificatif' : ldf.justif_ldf, 'date_mission' : ldf.date_mission}) 
              // on ajoute la ligne dans les lignes de frais
              this.listlignedefrais.push(
                { 'id_ldf' : ldf.id_ldf, 'avance' : true,
                  'montant_avance' : ldf.montant_avance, 'status' : this.transformStatus(ldf.statut_ldf), 
                  'id_mission' : ldf.id_mission, 'id_chef' : ldf.id_chef, 'mission' : ldf.nom_mission, 
                  'id_ndf' : ldf.id_ndf, 'date' : ldf.date_ldf, 'libelle' : ldf.libelle_ldf, 
                  'montant_estime' : ldf.montant_estime, 'montant' : ldf.montant_ldf, 
                  'commentaire' : ldf.commentaire_ldf, 'commentaire_refus' : ldf.motif_refus, 
                  'justificatif' : ldf.justif_ldf, 'date_mission' : ldf.date_mission})             
                  
            }
          }
          // on compte le nombre d'avances pouvant être envoyées
          if(ldf.statut_ldf == 'avnoSent')
            this.cntAvance += 1;
          // on compte le nombre de lignes pouvant être envoyées
          if(ldf.statut_ldf == 'noSent' || ldf.statut_ldf == 'noF')
            this.cntLdf += 1;
        });
        console.log(this.listlignedefrais)
        console.log(this.listavance)
        // creation du tableau avec les options sort et paginator
        this.dataSource = new MatTableDataSource<ILignedefrais>(this.listlignedefrais);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isDisabled = false;
    });
    
  }

  annulerEnvoi() {

    this.lignedefraisService
    .cancelSending({id : this.id_ndf });
    this.delay(1500).then(any => {
      this.refreshLignesdefrais();
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

  openDialogNouvelleAvance() {
    this.componentData.id_ldf = 0;
    this.componentData.id_mission = '';
    this.componentData.id_collab = this.id_collab;
    this.componentData.nom_mission = '';
    this.componentData.libelle = '';
    this.componentData.montant = '';
    this.componentData.commentaire = '';
    this.componentData.commentaire_refus = '';
    this.componentData.valide = false;
    const dialogRef = this.dialog.open(DialogNouvelleAvance, {
      data: { comp : this.componentData }
    });
    dialogRef.afterClosed().subscribe(result => {
      var temp = result;
      if(temp){
        if(temp.comp.valide) {
          this.delay(1500).then(any => {
            this.refreshLignesdefrais();
            this.openSnackBar('Demande d\'avance ajoutée')
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
        avance : element.avance, montant_avance : element.montant_avance,
        id_cds : element.id_chef, id_ndf : this.id_ndf
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
        avance : element.avance, id_cds : element.id_chef,
        id_ndf : this.id_ndf
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
    console.log('envoyer avance')
    console.log(this.listavance)
    this.listavance.forEach(element => {
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
    var listLdf : ILignedefraisShort[] = [];
    this.listlignedefrais.forEach( ligne => {
      if(ligne.avance && (ligne.status == 'Non envoyée' || ligne.status == 'Refusée Compta')) {
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
      else if(!ligne.avance && (ligne.status == 'Non envoyée' || ligne.status == 'Refusée Compta') && ligne.montant != 0)
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
      this.lignedefraisService.deleteAvance({
        id_ldf : ldf.id_ldf, id_ndf : this.id_ndf, id_cds : ldf.id_chef
      });
      this.delay(1500).then(any => {
        this.refreshLignesdefrais();
        this.openSnackBar('Avance supprimée');
      });
    }
    else {
      this.lignedefraisService.deleteLignedefrais({
        id_ldf : ldf.id_ldf, id_ndf : this.id_ndf, id_cds : ldf.id_chef
      });
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
      (ldf.status == 'Validée' || ldf.status == 'Attente Compta') ) ||
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
