import { Component, OnInit } from '@angular/core';
import { NotedefraisService } from './notedefrais.service';
import { INotedefrais } from './notedefrais.interface';
import { ILignedefrais } from '../lignedefrais/lignedefrais.interface';
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from '@angular/common';
import { isoStringToDate } from '@angular/common/src/i18n/format_date';

import * as CryptoJS from 'crypto-js'; 

@Component({
  selector: 'app-notedefrais',
  templateUrl: './notedefrais.component.html',
  styleUrls: ['./notedefrais.component.css'],
  providers: [DatePipe]
})
export class NotedefraisComponent implements OnInit {

  private sub : any;
  lnotedefrais: INotedefrais[];
  //data: Notedefrais = { id_ndf:null, id_collab:6, mois:null, annee:null, total:null, };
  dataS: String = '6';
  date = new Date();
  dateS: string;
  topthreeNdf: string[] = ['null', 'null','null'];
  topthreeMonth: string[] = ['null', 'null','null'];
  currentMissing : boolean = true;
  count : number = 0;

  //Param in URL
  username: string;
  param: string;
  id: any;
  route: string;

  //Variable pour encrypt/decrypt
  keySize: number = 256;
  ivSize : number = 128;
  iterations : number = 100;
  key  : any = "daouda";

  constructor(private notedefraisService: NotedefraisService , private router: Router,
    private datePipe: DatePipe, private activatedRoute: ActivatedRoute) { 
      //Récupère les paramètres passés dans l'URL
      this.activatedRoute.queryParams.subscribe(params => {
          this.username = params['user'];
          this.param = params['param'];
          this.dataS = this.decrypt(this.param, this.key);

          console.log("TEST " + router.url);
      var sub = activatedRoute.data.subscribe(v => console.log(v));

      });
    }
  
  ngOnInit() {
    this.sub = this.notedefraisService
      .getNotedefraisFromIdCollab({id : this.dataS})
        .subscribe( (data : INotedefrais[]) => {
          // récupération des données de la query
          this.lnotedefrais = data;
          // trie la liste de la plus récente à la plus ancienne
          if(this.lnotedefrais.length != 0){
            this.lnotedefrais.sort((a, b) => {   
              return b.annee.valueOf() - a.annee.valueOf() || b.mois.valueOf() - a.mois.valueOf();
            });
            // enlève les ndf validées
            // TODO


            // vérifie s'il existe une ndf pour le mois courrant
            this.dataS = this.datePipe.transform(this.date, 'yyyy-MM-dd');
            var str = this.dataS.split("-",2);
            
            if(+str[0] == this.lnotedefrais[0].annee 
              && +str[1] == this.lnotedefrais[0].mois){
                this.currentMissing = false;
              }

            if(this.lnotedefrais.length == 1 && this.currentMissing)
            {
              this.topthreeNdf[0] = "miss";
              this.topthreeMonth[0] = "miss";
              this.topthreeNdf[1] = this.lnotedefrais[0].id_ndf.toString();
              this.topthreeMonth[1] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[1].annee;
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
    this.router.navigate(['/lignedefrais', 0]);
  }
  
  ngOnDestroy() {
    console.log("destroy ndf ")
    this.sub.unsubscribe();
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

