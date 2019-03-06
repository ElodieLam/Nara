import { Component, OnInit, ViewChild } from '@angular/core';
import { NotedefraisService } from '../notedefrais/notedefrais.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { INotedefraisHistorique } from '../notedefrais/notedefrais.interface';
import * as CryptoJS from 'crypto-js'; 
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notedefraishistorique',
  templateUrl: './notedefraishistorique.component.html',
  styleUrls: ['./notedefraishistorique.component.css'],
  providers: [DatePipe]
})
/**
 * Responsable : Alban Descottes
 * Component qui affiche l'historique des notes de frais d'un collaborateur
 * Accessible pour tous les collaborateurs
 * Version mobile et ordinateur
 */
export class NotedefraishistoriqueComponent implements OnInit {

  sub: any;
  id_collab:number;
  listnotedefrais: INotedefraisHistorique[];
  date = new Date();
  mobileVersion:boolean = false;

  //Variable pour encrypt/decrypt
  keySize: number = 256;
  ivSize : number = 128;
  iterations : number = 100;
  key  : any = "daouda";

  listemois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  displayedColumns: string[] = ['annee', 'mois', 'voir'];
  dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private notedefraisservice : NotedefraisService, 
    private login : LoginComponent,
    private router : Router, private datePipe: DatePipe) {
    this.mobileVersion = this.login.mobileVersion;
    this.id_collab = this.login.user.id_collab
   }

  ngOnInit() {
    this.sub = this.notedefraisservice
    .getNotedefraisHistorique({id : this.id_collab})
    .subscribe( (data : INotedefraisHistorique[]) => {
      this.listnotedefrais = data;

      this.listnotedefrais.sort((a, b) => {   
        return b.annee.valueOf() - a.annee.valueOf() || b.mois.valueOf() - a.mois.valueOf();
      });
      this.listnotedefrais.forEach(ndf => {
        ndf.moisWord = this.listemois[+ndf.mois];
        if(ndf.wait == null)
          ndf.wait = 0;
      });

      var dataS = this.datePipe.transform(this.date, 'yyyy-MM-dd');
      var str = dataS.split("-",2);

      if(this.listnotedefrais.length == 0) {
        this.listnotedefrais.push({
          id_ndf : 0, annee : +str[0], mois : +str[1], moisWord : this.listemois[+str[1]], wait  : 0
        })
      }
      else {
        var noCurrent = true;
        this.listnotedefrais.forEach( ndf => {
          if(ndf.annee == +str[0] && ndf.mois == +str[1])
            noCurrent = false;
        })
        if(noCurrent)
          this.listnotedefrais.unshift({
            id_ndf : 0, annee : +str[0], mois : +str[1], moisWord : this.listemois[+str[1]], wait  : 0
          });
      }
      

      this.dataSource = new MatTableDataSource<INotedefraisHistorique>(this.listnotedefrais);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    
  }

  goToNotedefrais (element : INotedefraisHistorique) {
    var hiddenParam = element.id_ndf + "-" + element.annee + "-" + element.mois;
    var encrypted = this.encrypt(hiddenParam, this.key);
    this.router.navigate(['/lignedefrais',  encrypted.toString()  ]);
    
  }

  goToNewNotedefrais (element : INotedefraisHistorique) {
    this.notedefraisservice.createNotedefrais({
      id_collab : this.id_collab, annee : element.annee, mois : element.mois
    })
    this.delay(2000).then(any => {
      this.notedefraisservice.getNotedefraisMonthYear({
        id_collab : this.id_collab, annee : element.annee, mois : element.mois
      })
      .subscribe( (data : any) => {
        var temp = data;
        var hiddenParam = temp[0].id_ndf + "-" + element.annee + "-" + element.mois;
        var encrypted = this.encrypt(hiddenParam, this.key);
        this.router.navigate(['/lignedefrais',  encrypted.toString()  ]);
      });
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goBack() {
    this.router.navigate(['/notedefrais']);
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
}
