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
  displayedColumns: string[] = ['nom_mission', 'libelle_ldf', 'avance', 'montant', 'commentaire_ldf', 'justif_ldf', 'statut_ldf', 'accepter', 'refuser', 'motif_refus'];
  listNotedefrais: ILignedefraisListe[] = [];
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
    this.sub = this.gestionnotedefraisService
      .getLignesdefraisFromIdNdfIdCds({ id_ndf : this.id_ndf , id_cds : this.id_cds})
      .subscribe( (data : ILignedefraisListe[]) => {
        this.listNotedefrais = data;
        // console.log(this.listNotedefrais)
        this.listNotedefrais.forEach(element => {
          // le cds peut acceder à accepter et refuser
          element.modif = false;
          if(element.statut_ldf == 'attCds' || element.statut_ldf == 'avattCds')
            element.modif = true;
          // le cds peut acceder à annuler
          element.annuler = false;
          if(element.statut_ldf == 'attF' || element.statut_ldf == 'avattF' ||
            element.statut_ldf == 'noCds' || element.statut_ldf == 'avnoCds')
            element.annuler = true;

          element.avance = false;
          if(element.montant_estime)
            element.avance = true;
          if(element.montant_ldf > 0)
            element.montant_display = element.montant_ldf.toString();
          else
            element.montant_display = element.montant_avance + " / " + element.montant_estime;
        });
        this.dataSource = new MatTableDataSource<ILignedefraisListe>(this.listNotedefrais);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isDisabled = false;
    });
  }

  accepterLdf(id : number, avance : boolean, statut_ldf : String) {
    this.isDisabled = true;
    var stat = '';
    var statut = 0;
    if(avance && statut_ldf == 'avattCds')
      statut = 2;
    else
      statut = 8;
    if(avance) {
      console.log('accepter avance ' + statut)
      this.gestionnotedefraisService.updateAvancenotifToAndFromCompta( {
        id_ndf : this.id_ndf, motif : '', stat : statut, id_ldf : id, id_cds : this.id_cds
      });
    }
    else {
      console.log('accepter ldf ' + statut)
      this.gestionnotedefraisService.updateLdfnotifToAndFromCompta( {
        id_ndf : this.id_ndf, motif : '', stat : statut, id_ldf : id, id_cds : this.id_cds
      });
    }
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

  annulerLdf(id : number, avance : boolean, statut_ldf : String) {
    this.isDisabled = true;
    var statut = 0;
    var statutOld = 0;
    console.log(statut_ldf)
    if(avance && statut_ldf == 'avnoCds') {
      statut = 3;
      statutOld = 4;
    } 
    else if(avance && statut_ldf == 'avattF') {
      statut = 3;
      statutOld = 2;
    }
    else if(statut_ldf == 'attF') {
      statut = 7;
      statutOld = 8;
    }
    else {
      statut = 7;
      statutOld = 9;
    }
    if(avance) {
      console.log('annuler avance ' + statut)
      this.gestionnotedefraisService.updateAvancenotifToAndFromCompta( {
        id_ndf : this.id_ndf, motif : '', stat : statut, 
        id_ldf : id, id_cds : this.id_cds, statOld : statutOld
      });
    }
    else {
      console.log('annuler ldf ' + statut)
      this.gestionnotedefraisService.updateLdfnotifToAndFromCompta( {
        id_ndf : this.id_ndf, motif : '', stat : statut,
        id_ldf : id, id_cds : this.id_cds, statOld : statutOld
      });
    }
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
