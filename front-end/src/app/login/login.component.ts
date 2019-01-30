import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from "@angular/router";
import {Collaborateur} from './login.interface';
import { getMatInputUnsupportedTypeError } from '@angular/material';
import * as sha256 from 'sha256';
import * as CryptoJS from 'crypto-js'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user : Collaborateur = {id_collab: null, id_serviceCollab: null, nom_collab: null, prenom_collab: null, password: null} ;
  correct : boolean =  true;

  //Variable pour encrypt/decrypt
  keySize: number = 256;
  ivSize : number = 128;
  iterations : number = 100;
  key  : any = "daouda";

  constructor(private loginService: LoginService , private router: Router) { }

  ngOnInit() {
    console.log("Start loginService");  
  }


  //Récupère le user input
  loginUser(event){
    event.preventDefault();
    const target = event.target;
    const username = target.querySelector('#inputUsername').value;
    const password = target.querySelector('#inputPassword').value;
    console.log("input: " + username, password);

    //Create params
    var param = {nom: username, pass: password};

    //subscribe 
    this.loginService
      .getUserDetails(param)
        .subscribe( 
          (data : Array<Collaborateur>) => {
            console.log(data)
            this.correct = true;
            if(data.length == 0){
              console.log('User not found', data)
              this.correct = false;
            }
            else{
              this.saveIdentity(data[0]);
            }
          },
          error => console.log('Error loginService', error)     
      );

  }

  saveIdentity(data){
    this.user.id_collab = data.id_collab;
    this.user.id_serviceCollab = data.id_serviceCollab;
    this.user.nom_collab = data.nom_collab;
    this.user.prenom_collab = data.prenom_collab;
    this.user.password = data.password;
    console.log("User logged in ! ");
    console.log(this.user);
    this.goToDashboard();
  }

  goToDashboard(){
    //Param we want to encrypt
    var hiddenParam = this.user.id_collab.toString();

    //Encrypt-Decrypt
    var encrypted = this.encrypt(hiddenParam, this.key);
    console.log("Param encrypted: " + encrypted);
    var decrypted = this.decrypt(encrypted, this.key);
    var param = encrypted;
    console.log("Param decrypted: " + decrypted.toString(CryptoJS.enc.Utf8));

    //Create URL and route
    this.router.navigate(['/notifications/:id'], { queryParams: { user: this.user.nom_collab, param} });
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



}