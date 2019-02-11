import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { GestionnotedefraisService } from '../gestionnotedefrais/gestionnotedefrais.service';
import { ILignedefraisListe } from '../gestionnotedefrais/gestionnotedefrais.interface';
import { LoginComponent } from '../login/login.component';
import { ActivatedRoute } from '@angular/router';
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
  str:String[] = [];
  listemois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  displayedColumns: string[] = [
    'mission', 'libelle', 'montant', 'commentaire', 'justif', 'statut', 'accepter', 'refuser', 'motif'
  ];
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
    private login : LoginComponent, private route : ActivatedRoute,private dialog: MatDialog) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {

      var decrypted = this.decrypt(params['id'], this.key);
      //console.log("Param decrypted: " + decrypted.toString(CryptoJS.enc.Utf8));
      this.str = decrypted.toString(CryptoJS.enc.Utf8).split('-', 5);
      this.id_ndf = +this.str[0];
      this.prenom = this.str[1];
      this.nom = this.str[2];
      this.mois = this.str[3];
      this.annee = this.str[4];
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
          if(element.status_ldf == 'attCds' || element.status_ldf == 'avattCds')
            element.modif = true;
          // le cds peut acceder à annuler
          element.annuler = false;
          if(element.status_ldf == 'attF' || element.status_ldf == 'avattF' ||
            element.status_ldf == 'noCds' || element.status_ldf == 'avnoCds')
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
    });
  }

  accepterLdf(id : number, avance : boolean, statut : String) {
    var stat = '';
    if(avance && statut == 'avattCds')
      stat = 'avattF';
    else
      stat = 'attF';
    if(avance) {
      console.log('accepter avance ' + stat)
      this.gestionnotedefraisService.updateStatutAvance(
        { id : id, motif : '', statut : stat }
        );
    }
    else {
      console.log('accepter ldf ' + stat)
      this.gestionnotedefraisService.updateStatutLignedefrais(
        { id : id, motif : '', statut : stat }
      );
    }
    this.delay(1500).then(any => {
      this.refreshLignes();
    });
  }

  refuserLdf(id : number, avance : boolean, statut : string) {
    const dialogRef = this.dialog.open(DialogRefuserLigne, {
      data: { id : id, avance : avance, statut : statut }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.delay(1500).then(any => {
        this.refreshLignes();
      });
    });
  }

  annulerLdf(id : number, avance : boolean, statut : String) {
    var stat = '';
    console.log(statut)
    if(avance && (statut == 'avnoCds' || statut == 'avattF')) 
      stat = 'avattCds';
    else
      stat = 'attCds';
    if(avance) {
      console.log('annuler avance ' + stat)
      this.gestionnotedefraisService.updateStatutAvance(
        { id : id, motif : '', statut : stat }
        );
    }
    else {
      console.log('annuler ldf ' + stat)
      this.gestionnotedefraisService.updateStatutLignedefrais(
        { id : id, motif : '', statut : stat }
      );
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
