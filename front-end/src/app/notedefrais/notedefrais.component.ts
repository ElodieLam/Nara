import { Component, OnInit } from '@angular/core';
import { NotedefraisService } from './notedefrais.service';
import { INotedefrais } from './notedefrais.interface';
import { Router} from "@angular/router";
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js'; 
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-notedefrais',
  templateUrl: './notedefrais.component.html',
  styleUrls: ['./notedefrais.component.css'],
  providers: [DatePipe]
})
/**
 * Responsable : Alban Descottes
 * Component qui affiche la page de gestion des notes de frais pour un collaborateur
 * Accessible pour tous les collaborateurs
 */
export class NotedefraisComponent implements OnInit {

  private sub : any;
  lnotedefrais: INotedefrais[];
  dataS: String = '6';
  user: String = '0';
  date = new Date();
  dateS: string;
  topthreeNdf: string[] = ['null', 'null','null'];
  topthreeMonth: string[] = ['null', 'null','null'];
  currentMissing : boolean = true;
  count : number = 0;
  str : string[];
  spinner:boolean = false;
  mobile:boolean = false;
  //Variable pour encrypt/decrypt
  keySize: number = 256;
  ivSize : number = 128;
  iterations : number = 100;
  key  : any = "daouda";
  //Param in URL
  username: string;
  param: string;
  id: any;
  route: string;

  
  constructor(private notedefraisService: NotedefraisService , private router: Router,
    private datePipe: DatePipe, private login : LoginComponent) { 
      this.user = login.user.id_collab.toString();
    }
  
  ngOnInit() {
    this.sub = this.notedefraisService
    .getNotedefraisFromIdCollab({id : this.user})
    .subscribe( (data : INotedefrais[]) => {
      // récupération des données de la query
      this.lnotedefrais = data;
      this.dataS = this.datePipe.transform(this.date, 'yyyy-MM-dd');
      this.str = this.dataS.split("-",2);
      if(this.lnotedefrais.length != 0){
        // trie la liste de la plus récente à la plus ancienne
        this.lnotedefrais.sort((a, b) => {   
          return b.annee.valueOf() - a.annee.valueOf() || b.mois.valueOf() - a.mois.valueOf();
        });
        // vérifie s'il existe une ndf pour le mois courrant
        this.lnotedefrais.forEach( ndf => {
          if(+this.str[0] == ndf.annee && +this.str[1] == ndf.mois){
            this.currentMissing = false;
          }
        })

        if(this.lnotedefrais.length == 1 && this.currentMissing)
        {
          this.topthreeNdf[0] = "miss";
          this.topthreeMonth[0] = "miss";
          this.topthreeNdf[1] = this.lnotedefrais[0].id_ndf.toString();
          this.topthreeMonth[1] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[0].annee;
          this.count = 2;
        }
        else if(this.lnotedefrais.length == 1)
        {
          this.topthreeNdf[0] = this.lnotedefrais[0].id_ndf.toString();
          this.topthreeMonth[0] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[0].annee;
          this.count = 1;
        }
        else if(this.lnotedefrais.length == 2 && this.currentMissing)
        {
          this.topthreeNdf[0] = "miss";
          this.topthreeMonth[0] = "miss";
          this.topthreeNdf[1] = this.lnotedefrais[0].id_ndf.toString();
          this.topthreeMonth[1] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[0].annee;
          this.topthreeNdf[2] = this.lnotedefrais[1].id_ndf.toString();
          this.topthreeMonth[2] = this.lnotedefrais[1].mois + "-" + this.lnotedefrais[1].annee;
          this.count = 3;
        }
        else if(this.lnotedefrais.length == 2)
        {
          this.topthreeNdf[0] = this.lnotedefrais[0].id_ndf.toString();
          this.topthreeMonth[0] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[0].annee;
          this.topthreeNdf[1] = this.lnotedefrais[1].id_ndf.toString();
          this.topthreeMonth[1] = this.lnotedefrais[1].mois + "-" + this.lnotedefrais[1].annee;
          this.count = 2;
        }
        else if(this.lnotedefrais.length > 2 && this.currentMissing)         
        {
          this.topthreeNdf[0] = "miss";
          this.topthreeMonth[0] = "miss";
          this.topthreeNdf[1] = this.lnotedefrais[0].id_ndf.toString();
          this.topthreeMonth[1] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[0].annee;
          this.topthreeNdf[2] = this.lnotedefrais[1].id_ndf.toString();
          this.topthreeMonth[2] = this.lnotedefrais[1].mois + "-" + this.lnotedefrais[1].annee;
          this.count = 3;
        }
        else         
        {
          this.topthreeNdf[0] = this.lnotedefrais[0].id_ndf.toString();
          this.topthreeMonth[0] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[0].annee;
          this.topthreeNdf[1] = this.lnotedefrais[1].id_ndf.toString();
          this.topthreeMonth[1] = this.lnotedefrais[1].mois + "-" + this.lnotedefrais[1].annee;
          this.topthreeNdf[2] = this.lnotedefrais[2].id_ndf.toString();
          this.topthreeMonth[2] = this.lnotedefrais[2].mois + "-" + this.lnotedefrais[2].annee;
          this.count = 3;
        }
      }
    }); 
  }
  
  goToNotedefrais () {
        this.spinner = true;
        this.notedefraisService.createNotedefrais({
          id_collab : this.user, annee : this.str[0], mois : this.str[1]
        })
        this.delay(2000).then(any => {
          this.notedefraisService.getNotedefraisMonthYear({
            id_collab : this.user, annee : this.str[0], mois : this.str[1]
          })
          .subscribe( (data : any) => {
            var temp = data;
            var hiddenParam = temp[0].id_ndf + "-" + this.str[0] + "-" + this.str[1];
            var encrypted = this.encrypt(hiddenParam, this.key);
            this.router.navigate(['/lignedefrais',  encrypted.toString()  ]);
          });
        });
  }

  goToHistorique() {
    this.router.navigate(['/notedefraishistorique']);
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

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

