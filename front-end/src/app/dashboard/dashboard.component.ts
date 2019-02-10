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
  isCDS: boolean = false;
  //param: string;
  isOn: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private activatedRoute: ActivatedRoute, private login: LoginComponent) {
    this.isOn = true;
    //Récupère les paramètres passés dans l'URL
    this.activatedRoute.queryParams.subscribe(params => {
        this.firstname = login.user.prenom_collab;
        this.lastname = login.user.nom_collab;
        this.isCDS = login.user.isCDS;
        //this.param = params['param'];
      });
  }

  ngOnInit(){
    console.log("userId in dashboard: " + this.login.getUserId());
  }

  goToNotif(){
    this.router.navigate(['/notifications/']); 
  }

  goToConge(){
    this.router.navigate(['/conge']); 
  }

  goToNDF(){
    this.router.navigate(['/notedefrais']); 
  }
  
  goToGestionConge(){
    //this.router.navigate(['/notedefrais']); 
  }
  
  goToGestionNDF(){
    this.router.navigate(['/gestionnotedefrais']); 
  }

  logout(){
    console.log("logged out");
    this.isOn = false;
    this.firstname = '';
    this.lastname = '';
    this.isCDS = false;
    this.router.navigate(['/login']); 
    //this.param = "";
    
  }

  

}
