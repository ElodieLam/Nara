import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { GestionnotedefraisService } from '../gestionnotedefrais/gestionnotedefrais.service';
import { ILignedefraisListe } from '../gestionnotedefrais/gestionnotedefrais.interface';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'; 
import { DialogRefuserLigne } from './dialog-refuser-ligne.component';
import { SnackBarComponent } from '../lignedefrais/lignedefrais.component';

@Component({
  selector: 'app-gestionlignedefrais',
  templateUrl: './gestionlignedefrais.component.html',
  styleUrls: ['./gestionlignedefrais.component.css']
})
/**
 * Responsable : Alban Descottes
 * Component qui permet à un chef de service de gérer une note de frais d'un collaborateur 
 * Accessible pour tous les chefs de service
 * Version mobile et ordinateur
 */
export class GestionlignedefraisComponent implements OnInit {

  id_cds:number;
  id_ndf:number;
  nom:String = '';
  prenom:String ='';
  mois:String = '';
  annee:String = '';
  id_collab:number = 0;
  str:String[] = [];
  isDisabled:boolean = true;

  listemois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  dataSource;
  displayedColumns: string[] = ['nom_mission', 'libelle_ldf', 'montant', 'commentaire_ldf', 'justif_ldf', 'statut_ldf', 'refuser', 'motif_refus'];
  dataSourceMobile;
  displayedColumnsMobile: string[] = ['ldf'];
  listNotedefrais: ILignedefraisListe[] = [];
  listavance: ILignedefraisListe[] = [];
  listlignedefrais: ILignedefraisListe[] = [];
  cancel:boolean = false;
  accept:boolean = true;
  cancelAv:boolean = false;
  acceptAv:boolean = false;
  noLine:boolean = true;
  mobileVersion:boolean = false;
  sub : any;

  //Variable pour encrypt/decrypt
  keySize: number = 256;
  ivSize : number = 128;
  iterations : number = 100;
  key  : any = "daouda";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private gestionnotedefraisService : GestionnotedefraisService,
    private login : LoginComponent, private route : ActivatedRoute,
    private dialog: MatDialog, private router : Router, private snackBar: MatSnackBar) {
      this.mobileVersion = this.login.mobileVersion;
     }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {

      var decrypted = this.decrypt(params['id'], this.key);
      this.str = decrypted.toString(CryptoJS.enc.Utf8).split('-', 6);
      this.id_ndf = +this.str[0];
      this.prenom = this.str[1];
      this.nom = this.str[2];
      this.mois = this.str[3];
      this.annee = this.str[4];
      this.id_collab = +this.str[5];

    });
    this.id_cds = this.login.user.id_collab;
    this.refreshLignes();
  }

  refreshLignes() {
    this.listavance = [];
    this.listlignedefrais = [];
    this.sub = this.gestionnotedefraisService
      .getLignesdefraisFromIdNdfIdCds({ id_ndf : this.id_ndf , id_cds : this.id_cds})
      .subscribe( (data : ILignedefraisListe[]) => {
        this.listNotedefrais = data;
        this.listNotedefrais.forEach(element => {
          if(!this.cancel)
            element.statut_ldf == 'noCds' ? this.cancel = true : {} ;
          if(this.accept)
            element.statut_ldf == 'noCds' ? this.accept = false : {} ;
          if(!this.acceptAv)
            element.statut_ldf == 'avattCds' ? this.acceptAv = true : {} ;
          if(!this.cancelAv)
            element.statut_ldf == 'avattCds' ? this.cancelAv = true : {} ;
          if(element.montant_avance != null)
            element.avance = true;
          element.refutable = false;
          if(element.statut_ldf == 'attCds')
            element.refutable = true;
          if(element.statut_ldf == 'avattCds') {
            element.avacceptable = true;
            element.avrefutable = true;
          }
          if(element.montant_avance == null) {
            if(element.statut_ldf != 'noSent')
              this.listlignedefrais.push(element);
          }
          else {
            if(element.statut_ldf != 'avnoSent') {
              if(element.id_ndf != this.id_ndf) {
                if(element.id_ndf_ldf == this.id_ndf && element.statut_ldf != 'noSent') {
                  this.listlignedefrais.push(element);
                }
              }
              else {
                if(element.id_ndf_ldf != this.id_ndf) {
                  this.listavance.push(element);
                }
                else {
                  this.listavance.push(element);
                  if(element.statut_ldf != 'avattCds' && element.statut_ldf != 'avnoCds'
                  && element.statut_ldf != 'avattF' && element.statut_ldf != 'avnoF'
                  && element.statut_ldf != 'noSent') {
                    this.listlignedefrais.push(element);

                  }
                }
              }
            }
          }
        });
        if(this.mobileVersion) {
          this.dataSourceMobile = new MatTableDataSource<ILignedefraisListe>(this.listlignedefrais);
          this.dataSourceMobile.paginator = this.paginator;

        }
        else {
          this.dataSource = new MatTableDataSource<ILignedefraisListe>(this.listlignedefrais);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        this.isDisabled = false;
    });
  }

  accepterLignes() {
    this.gestionnotedefraisService
      .accepterNotedefrais({
        id_ndf : this.id_ndf, id_cds : this.id_cds
      })
    this.delay(2000).then(any => {
      this.openSnackBar('Note de frais acceptée', 750)
      this.refreshLignes();
    });
  }

  renvoyerLignes() {
    this.gestionnotedefraisService
      .renvoyerNotedefrais({
        id_ndf : this.id_ndf, id_cds : this.id_cds
      })
    this.delay(2000).then(any => {
      this.openSnackBar('Note de frais renvoyée', 750)
      this.refreshLignes();
    });
  }

  refuserLdf(id : number, avance : boolean, statut : string) {
    const dialogRef = this.dialog.open(DialogRefuserLigne, {
      data: { id : id, avance : avance, statut : statut, id_ndf : this.id_ndf, id_cds : this.id_cds }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.delay(2000).then(any => {
        if(avance) {
          this.openSnackBar('Avance refusée', 750)
        }
        else {
          this.openSnackBar('Ligne de frais refusée', 750)
        }
        this.refreshLignes();
      });
    });
  }
  
  accepterAvance(id : number) {
    this.gestionnotedefraisService
      .accepterAvance({
        id_ldf : id, id_ndf : this.id_ndf, id_cds : this.id_cds
      })
    this.delay(2000).then(any => {
      this.openSnackBar('Avance acceptée', 750)
      this.refreshLignes();
    });
  }

  accepterAllAvance() {
    this.gestionnotedefraisService
      .accepterAllAvance({
        id_ndf : this.id_ndf, id_cds : this.id_cds
      })
    this.delay(2000).then(any => {
      this.openSnackBar('Avances acceptées', 750)
      this.refreshLignes();
    });
  }

  refuserAllAvance() {
    this.gestionnotedefraisService
      .refuserAllAvance({
        id_ndf : this.id_ndf, id_cds : this.id_cds
      })
    this.delay(2000).then(any => {
      this.openSnackBar('Avances refusées', 750)
      this.refreshLignes();
    });
  }

  transformStatut(statut : string) {
    if(statut == 'val')
      return 'Validée'
    if(statut == 'noCds')
      return 'Refus du Chef de service'
    if(statut == 'noF')
      return 'Refus de laCompta'
    if(statut == 'attCds')
      return 'En attente du Chef de service'
    if(statut == 'attF')
      return 'En attente de la Compta'
    return 'unknown'
  }

  openSnackBar(msg: string, duration : number) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: duration,
      data : msg
    });
  }

  goBack() {
    this.router.navigate(['/gestionnotedefrais']);
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
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
