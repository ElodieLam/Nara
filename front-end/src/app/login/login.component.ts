import { Component, OnInit, ViewChild} from '@angular/core';
import { LoginService } from './login.service';
import { Router } from "@angular/router";
import {Collaborateur} from './login.interface';

/**
 * Responsable: E. Lam
 * Component de la page de login
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public innerWidth: any;
  public mobileVersion: boolean = false;
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
    if(window.innerWidth < 400)
      this.mobileVersion = true;
  }

  //Récupère le user input
  loginUser(event){
    event.preventDefault();
    const target = event.target;
    const username = target.querySelector('#inputUsername').value;
    const password = target.querySelector('#inputPassword').value;
    

    //Create params
    var param = {nom: username, pass: password};
    //subscribe 
    this.loginService
      .getUserDetails(param)
        .subscribe( 
          (data : Collaborateur[]) => {
            if(data.length == 0){
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
    if(this.user.id_collab == this.user.id_chefDeService) 
      this.user.isCDS = true;
    else 
      this.user.isCDS = false;
    console.log("User logged in ! ");
   
    this.goToDashboard();
  }

  //Navigate to dashboard (notifications page)
  goToDashboard(){
    this.isOn = true; //Hide login component and show dashboard
    this.router.navigate(['/notifications']); 
  }

  /**
   * Méthode remettant à null tous les champs lorsque l'utilisateur se déconnecte
   */
  setUserNull(){
    this.user.id_collab = null;
    this.user.id_service = null;
    this.user.nom_collab = null;
    this.user.prenom_collab = null;
  }


}