import { Component, Input, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from "@angular/router";
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  firstname: string = '';
  lastname: string = '';
  service: string = '';
  cds: string = '';
  isCDS: boolean = false;
  isCompta: boolean = false;
  isRH: boolean = false;
  //param: string;
  isOn: boolean = false;
  date: Date


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private activatedRoute: ActivatedRoute, private login: LoginComponent) {
    this.isOn = true;
    this.date = new Date();
    //Récupère les paramètres passés dans l'URL
    this.activatedRoute.queryParams.subscribe(params => {
      //this.param = params['param'];
    });
    this.firstname = login.user.prenom_collab;
    this.lastname = login.user.nom_collab;
    this.isCDS = login.user.isCDS;
    this.isCompta = login.user.id_service == 2 ? true : false;
    this.isRH = login.user.id_service == 1 ? true : false;
    this.service = login.user.nom_service;
    this.cds = this.isCDS ? 'Chef de service' : '';
  }

  ngOnInit(){
    console.log("userId in dashboard: " + this.login.getUserId());
  }

  goToNotif(){
    this.router.navigate(['/notifications/']); 
  }

  goToNotifService(){
    this.router.navigate(['/notifications/service']); 
  }

  goToConge(){
    this.router.navigate(['/conge']); 
  }

  goToNDF(){
    this.router.navigate(['/notedefrais']); 
  }

  goToGestionConge(){

  }

  goToGestionRH(){

  }
  
  goToGestionNDF(){
    this.router.navigate(['/gestionnotedefrais']); 
  }
  
  goToGestionCompta(){
    this.router.navigate(['/servicecompta']); 
  }

  logout(){
    console.log("logged out");
    this.isOn = false;
    this.firstname = '';
    this.lastname = '';
    this.isCDS = false;
    this.router.navigate(['/login']); 
  }


  

}
