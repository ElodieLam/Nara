import { Component, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'; 
import { LoginComponent } from '../login/login.component';

/**
 * Responsable: E.LAM, A.Descottes
 * Component contenant les informations à afficher d'une notification d'un collaborateur simple
 */

@Component({
  selector: 'app-notif-msg',
  templateUrl: './notif-msg.component.html',
  styleUrls: ['./notif-msg.component.css']
})
export class NotifMsgComponent implements OnInit {

  private sub : any;
  @Input() ndf;
  @Input() id;
  @Input() type;
  @Input() date;
  @Input() statut;
  @Input() color;
  @Input() dateNotif;


  componentData : any = {
    ndf : false,
    id: 0,
    type : "",
    date : "",
    statut: "",
    color: "",
    dateNotif: "",
  }

  mobileVersion:boolean = false;

  //Variable pour encrypt/decrypt
  keySize: number = 256;
  ivSize : number = 128;
  iterations : number = 100;
  key  : any = "daouda";

  constructor(private router : Router, private login : LoginComponent) { 
    this.mobileVersion = this.login.mobileVersion;
  }
 
  ngOnInit() {
      //infos à afficher dans le tableau
      this.componentData.ndf = (this.ndf == 'true') ? true : false;
      this.componentData.id = this.id;
      this.componentData.type = this.type;
      this.componentData.date = this.date;
      this.componentData.statut = this.statut;
      this.componentData.color = this.color;
      this.componentData.dateNotif = this.dateNotif;  
  }

  goToConge() {
    this.router.navigate(['/conge']); 
  }

  getTrColor(type){
    if (type == "Demande de congé") {
      this.color = "orange";
      return this.color;
    } 
    else if (type == "Note de frais") {
      this.color = "cyan";
      return this.color;
    }
  }

  goToNdf () {
    var str = this.date.split(" ", 2)
    var mois = (str[0] == 'Janvier') ? 1 :
    (str[0] == 'Février') ? 2 :
    (str[0] == 'Mars') ? 3 :
    (str[0] == 'Avril') ? 4 :
    (str[0] == 'Mai') ? 5 :
    (str[0] == 'Juin') ? 6 :
    (str[0] == 'Juillet') ? 7 :
    (str[0] == 'Aout') ? 8 :
    (str[0] == 'Septembre') ? 9 :
    (str[0] == 'Octobre') ? 10 :
    (str[0] == 'Novembre') ? 11 :
    (str[0] == 'Décembre') ? 12 : 0;

    var hiddenParam = this.id + "-" + str[1] + "-" + mois;
    //Encrypt-Decrypt
    var encrypted = this.encrypt(hiddenParam, this.key);
    this.router.navigate(['/lignedefrais',  encrypted.toString()  ]);
    
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
