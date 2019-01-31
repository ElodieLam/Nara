import { Component} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  username: string;
  param: string;
  isOn: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private activatedRoute: ActivatedRoute) {
    this.isOn = true;
    //Récupère les paramètres passés dans l'URL
    this.activatedRoute.queryParams.subscribe(params => {
          this.username = params['user'];
          this.param = params['param'];
      });
  }

  goToNotif(){
    this.router.navigate(['/notifications/:id'], { queryParams: { user: this.username, param: this.param} } ); 
  }

  goToConge(){
    this.router.navigate(['/conge/:id'], { queryParams: { user: this.username, param: this.param} } ); 
  }

  goToNDF(){
    this.router.navigate(['/notedefrais/:id'], { queryParams: { user: this.username, param: this.param} } ); 
  }

  logout(){
    this.isOn = false;
    this.router.navigate(['/login']); 
    this.username = "";
    this.param = "";
    
  }
  

}
