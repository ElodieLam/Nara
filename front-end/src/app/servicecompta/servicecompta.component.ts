import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ServicecomptaService } from './servicecompta.service';
import { INotedefraisListe } from './servicecompta.interface';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'; 


@Component({
  selector: 'app-servicecompta',
  templateUrl: './servicecompta.component.html',
  styleUrls: ['./servicecompta.component.css']
})
export class ServicecomptaComponent implements OnInit {

  id_cds:number;
  listemois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  displayedColumns: string[] = ['nom_service', 'date', 'nom', 'mois', 'avance', 'nb_lignes', 'voir'];
  listNotedefrais: INotedefraisListe[] = [];
  dataSource;

  //Variable pour encrypt/decrypt
  keySize: number = 256;
  ivSize : number = 128;
  iterations : number = 100;
  key  : any = "daouda";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private servicecomptaService : ServicecomptaService,
    private login : LoginComponent, private router : Router) { }

  ngOnInit() {
    this.id_cds = this.login.user.id_collab;
    this.servicecomptaService
      .getNotedefraisToCompta({ id : this.login.user.id_collab })
      .subscribe( (data : INotedefraisListe[]) => {
        
        this.listNotedefrais = data;
        console.log(this.listNotedefrais)
        this.dataSource = new MatTableDataSource<INotedefraisListe>(this.listNotedefrais);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  temp() {

  }

  goToGestionlignedefrais(element : any) {

    var hiddenParam = element.id_ndf + '-' +element.nom_service + '-' + element.prenom_collab + 
      '-' + element.nom_collab + '-' + this.listemois[element.mois] + '-' + element.annee;
    //Encrypt-Decrypt
    console.log(hiddenParam)
    var encrypted = this.encrypt(hiddenParam, this.key);
    //console.log("Param encrypted: " + encrypted);
    //var decrypted = this.decrypt(encrypted, this.key);
    //var param = encrypted;
    //console.log("Param decrypted: " + decrypted.toString(CryptoJS.enc.Utf8));
    this.router.navigate(['/servicecompta',  encrypted.toString()  ]);
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
}
