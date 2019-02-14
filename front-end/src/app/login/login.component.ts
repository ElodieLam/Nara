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

  user : Collaborateur = {id_collab: null, id_serviceCollab: null, nom_collab: null, prenom_collab: null, password: null} ;
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

  //Save user infos and go to dashboard
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

  //Navigate to dashboard (notifications page)
  goToDashboard(){
    this.isOn = true; //Hide login component and show dashboard
    this.router.navigate(['/notifications']); 
  }




}