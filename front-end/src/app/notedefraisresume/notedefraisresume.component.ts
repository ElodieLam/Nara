import { Component, OnInit, Input, SimpleChange, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { NotedefraisService } from '../notedefrais/notedefrais.service';
import { INotedefraisresume } from './notedefraisresume.interface';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'; 


@Component({
  selector: 'app-notedefraisresume',
  templateUrl: './notedefraisresume.component.html',
  styleUrls: ['./notedefraisresume.component.css']
})
/**
 * Responsable : Alban Descottes
 * Component affiche le resumé d'une note de frais
 * Accessible pour tous les collaborateurs
 */
export class NotedefraisresumeComponent implements OnInit, OnChanges {
  // input du component
  @Input() id_notedefrais = 0;
  @Input() moisAnnee = "mm-aaaa";
  
  // pour la liste des données
  private _id_ndf: number;
  private sub: any;
  listLignedefrais: INotedefraisresume[];
  listtodisplay: INotedefraisresume[];
  listemois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  mois : number = 0;
  annee : number = 0;
  dateVerbose : string;
  displayedColumns: string[] = ['nom_mission', 'libelle_ldf', 'avance', 'statut_ldf'];
  dataSource;
  values:boolean = true;
  lignesValid:number = 0;
  lignesTotal:number = 0;
  nbAvance:number = 0;
  ndfValid:boolean = false;

  //Variable pour encrypt/decrypt
  keySize: number = 256;
  ivSize : number = 128;
  iterations : number = 100;
  key  : any = "daouda";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private notedefraisService : NotedefraisService, private router : Router) {
  }
  
  ngOnInit() {
  }
  
  ngOnChanges(changes: SimpleChanges) {
    const id: SimpleChange = changes.id_notedefrais;
    this._id_ndf = id.currentValue.toUpperCase();
    this.listtodisplay = [];
    this.sub = this.notedefraisService
      .getNotedefraisresumeFromIdNdf({id : this.id_notedefrais})
      .subscribe( (data : INotedefraisresume[]) => {
        this.listLignedefrais = data;
        var temp = this.moisAnnee.split("-",2);
        this.listLignedefrais.forEach( ligne => {
          
          ligne.isAvance = false;
          ligne.no = false;
          ligne.wait = false;
          ligne.val = false;
          ligne.nosent = false;
          ligne.statut_ldf == 'val' ? ligne.val = true : ( 
            (ligne.statut_ldf == 'noCds' || ligne.statut_ldf == 'noF' ||
            ligne.statut_ldf == 'avnoCds' || ligne.statut_ldf == 'avnoF') ? ligne.no = true : (
              (ligne.statut_ldf == 'noSent' || ligne.statut_ldf == 'avnoSent') ? 
                ligne.nosent = true : ligne.wait = true));
          ligne.statut_ldf == 'val' ? this.lignesValid++ : {};
          if(ligne.statut_ldf == 'avnoSent' || ligne.statut_ldf == 'avnoCds' ||
             ligne.statut_ldf == 'avnoF' || ligne.statut_ldf == 'avattCds' || 
             ligne.statut_ldf == 'avattF') {
              ligne.isAvance = true;
              if(ligne.id_ndf == this.id_notedefrais) {
                this.listtodisplay.push(ligne);
                this.nbAvance++;
                this.lignesTotal++;
              }
          }
          else {
            if((ligne.id_ndf_ldf == this.id_notedefrais) || 
            (ligne.id_ndf_ldf == null && ligne.id_ndf == this.id_notedefrais) ) {
              this.listtodisplay.push(ligne);
              this.lignesTotal++;
            } 
          }
        });
        this.mois = +temp[0];
        this.annee = +temp[1];
        if(this.nbAvance == 0 && this.lignesTotal == this.lignesValid)
          this.ndfValid = true;
        this.dateVerbose = this.listemois[this.mois] + " " + this.annee;
        this.dataSource = new MatTableDataSource<INotedefraisresume>(this.listtodisplay);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if(this.listLignedefrais.length == 0) {
          this.values = false;
        }
    });
  }

  goToNotedefrais () {
    var hiddenParam = this.id_notedefrais + "-" + this.annee + "-" + this.mois;
        //Encrypt-Decrypt
        var encrypted = this.encrypt(hiddenParam, this.key);
        this.router.navigate(['/lignedefrais',  encrypted.toString()  ]);
    
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}
