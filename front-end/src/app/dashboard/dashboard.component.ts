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

  isOn: boolean = false;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private activatedRoute: ActivatedRoute, private login: LoginComponent) {
    this.isOn = true;
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
 
  logout(){
    this.isOn = false;
    this.router.navigate(['/login']); 
    this.login.setUserNull();
  }


  

}
