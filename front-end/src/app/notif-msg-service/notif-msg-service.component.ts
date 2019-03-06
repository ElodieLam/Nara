import { Component, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'; 
import { LoginComponent } from '../login/login.component';

/**
 * Responsable: E.LAM, A.Descottes
 * Component à l'intérieur de la page des notifications qui affiche les informations d'une notification d'un chef de service 
 */

@Component({
  selector: 'app-notif-msg-service',
  templateUrl: './notif-msg-service.component.html',
  styleUrls: ['./notif-msg-service.component.css']
})
export class NotifMsgServiceComponent implements OnInit {

  private sub : any;
  @Input() ndfforcds;
  @Input() congeforcds;
  @Input() service;
  @Input() id_notif;
  @Input() id;
  @Input() type;
  @Input() date;
  @Input() statut;
  @Input() prenom;
  @Input() nom;
  @Input() color;


  componentData : any = {
    type_notif : 0,
    id_notif : 0,
    id: 0,
    type : "",
    date : "",
    statut: "",
    color: ""
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
      if(this.ndfforcds != '')
        this.componentData.type_notif = (this.ndfforcds == 1) ? 1 : 2;
      if(this.congeforcds != '')
        this.componentData.type_notif = (this.congeforcds == 1) ? 3 : 4;
      this.componentData.id_notif = this.id_notif;
      this.componentData.id = this.id;
      this.componentData.type = this.type;
      this.componentData.date = this.date;
      this.componentData.statut = this.statut;
      this.componentData.color = this.color;
  }

  /**
   * Méthode changeant la couleur en fonction de la notification
   * @param type 
   */
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

  /**
   * Méthode routant à la note de frais CDS correspondante
   */
  goToNdfCDS () {
    var str = this.date.split(" ", 2);
    var hiddenParam = this.id_notif + '-' + this.prenom + '-' + this.nom + '-' 
      + str[0] + '-' + str[1] + '-' + this.id;
    var encrypted = this.encrypt(hiddenParam, this.key);
    this.router.navigate(['/gestionnotedefrais', encrypted.toString()]);
  }

  /**
   * Méthode routant à la note de frais compta correspondante
   */
  goToNdfCompta () {
    var str = this.date.split(" ", 2);
    var hiddenParam = this.id_notif + '-' + this.service + '-' + this.prenom + 
      '-' + this.nom + '-' + str[0] + '-' + str[1];
    var encrypted = this.encrypt(hiddenParam, this.key);
    this.router.navigate(['/servicecompta',  encrypted.toString()  ]);
  }
  
  /**
   * Méthode routant à la demande de conge CDS correspondante
   */
  goToCongeCDS () {
    this.router.navigate(['/gestionconge']);  
  }

    /**
   * Méthode routant à la demande de conge RH correspondante
   */
  goToCongeRH () {
    this.router.navigate(['/servicerh']);
  }

  /**
   * Méthode pour encrypter un string
   * @param msg 
   * @param key 
   */
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
