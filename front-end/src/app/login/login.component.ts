import { Component, OnInit, ViewChild} from '@angular/core';
import { LoginService } from './login.service';
import { Router } from "@angular/router";
import {Collaborateur} from './login.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //user Input
  username: string;
  param: string;

  user : Collaborateur = null;
  correct : boolean =  true;
  isOn : boolean = false;

  constructor(private loginService: LoginService , private router: Router) { }

  getUserId(){
    return this.user.id_collab;
  }


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
          (data : Collaborateur[]) => {
            if(data.length == 0){
              console.log('User not found', data)
              this.correct = false;
            }
            else{
              this.user = data[0];
              this.correct = true;
              this.saveIdentity();
            }
          },
          error => console.log('Error loginService', error)     
      );
  }

  //Save user infos and go to dashboard
  saveIdentity(){
/*    this.user.id_collab = data.id_collab;
    this.user.id_service = data.id_service;
    this.user.nom_service = data.nom_service;
    this.user.id_chefDeService = data.id_chefDeService;
    this.user.nom_collab = data.nom_collab;
    this.user.prenom_collab = data.prenom_collab;*/
    if(this.user.id_collab == this.user.id_chefDeService) {
      this.user.isCDS = true;
    }
    console.log("User logged in ! ");
    //console.log(this.user);

    this.goToDashboard();
  }

  //Navigate to dashboard (notifications page)
  goToDashboard(){
    this.isOn = true; //Hide login component and show dashboard
    this.router.navigate(['/notifications']); 
  }

  setUserNull(){
    this.user.id_collab = null;
    this.user.id_serviceCollab = null;
    this.user.nom_collab = null;
    this.user.password = null;
    this.user.prenom_collab = null;
  }


}