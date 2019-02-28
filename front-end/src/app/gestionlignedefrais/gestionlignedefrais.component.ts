import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { GestionnotedefraisService } from '../gestionnotedefrais/gestionnotedefrais.service';
import { ILignedefraisListe } from '../gestionnotedefrais/gestionnotedefrais.interface';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'; 
import { DialogRefuserLigne } from './dialog-refuser-ligne.component';

@Component({
  selector: 'app-gestionlignedefrais',
  templateUrl: './gestionlignedefrais.component.html',
  styleUrls: ['./gestionlignedefrais.component.css']
})
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
  displayedColumns: string[] = ['nom_mission', 'libelle_ldf', 'montant', 'commentaire_ldf', 'justif_ldf', 'statut_ldf', 'refuser', 'motif_refus'];
  listNotedefrais: ILignedefraisListe[] = [];
  listavance: ILignedefraisListe[] = [];
  listlignedefrais: ILignedefraisListe[] = [];
  cancel:boolean = false;
  accept:boolean = true;
  cancelAv:boolean = false;
  acceptAv:boolean = false;
  dataSource;
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
    private dialog: MatDialog, private router : Router) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {

      var decrypted = this.decrypt(params['id'], this.key);
      //console.log("Param decrypted: " + decrypted.toString(CryptoJS.enc.Utf8));
      this.str = decrypted.toString(CryptoJS.enc.Utf8).split('-', 6);
      console.log(this.str)
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
        // console.log(this.listNotedefrais)
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
          if(element.statut_ldf == 'avattCds' || element.statut_ldf == 'avnoCds'
            || element.statut_ldf == 'avattF')
            this.listavance.push(element);
          else
            this.listlignedefrais.push(element);
            
        });
        console.log(this.listavance)
        console.log(this.listlignedefrais)
          
        this.dataSource = new MatTableDataSource<ILignedefraisListe>(this.listlignedefrais);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isDisabled = false;
    });
  }

  accepterLignes() {
    console.log('accepter')
    console.log(this.listlignedefrais.length)
    this.gestionnotedefraisService
      .accepterNotedefrais({
        id_ndf : this.id_ndf, id_cds : this.id_cds
      })
    this.delay(1500).then(any => {
      this.refreshLignes();
    });
  }

  renvoyerLignes() {
    this.gestionnotedefraisService
      .renvoyerNotedefrais({
        id_ndf : this.id_ndf, id_cds : this.id_cds
      })
    this.delay(1500).then(any => {
      this.refreshLignes();
    });
  }

  refuserLdf(id : number, avance : boolean, statut : string) {
    const dialogRef = this.dialog.open(DialogRefuserLigne, {
      data: { id : id, avance : avance, statut : statut, id_ndf : this.id_ndf, id_cds : this.id_cds }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.delay(1500).then(any => {
        this.refreshLignes();
      });
    });
  }
  
  accepterAvance(id : number) {
    this.gestionnotedefraisService
      .accepterAvance({
        id_ldf : id, id_ndf : this.id_ndf, id_cds : this.id_cds
      })
    this.delay(1500).then(any => {
      this.refreshLignes();
    });
  }

  accepterAllAvance() {
    this.gestionnotedefraisService
      .accepterAllAvance({
        id_ndf : this.id_ndf, id_cds : this.id_cds
      })
    this.delay(1500).then(any => {
      this.refreshLignes();
    });
  }

  refuserAllAvance() {
    this.gestionnotedefraisService
      .refuserAllAvance({
        id_ndf : this.id_ndf, id_cds : this.id_cds
      })
    this.delay(1500).then(any => {
      this.refreshLignes();
    });
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
