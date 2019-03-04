import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
}
   
)
export class DemandecongeService 
{
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';
  
  
  getDemandecongesFromIdCollab(data)
  {
    return this
      .http
      .get(`${this.url}/demandeconge/demandecongesid`, { params : data});
  }

  createDemandeconges(data)
  {
    console.log("oh bosetti");
    return this
      .http
      .post(`${this.url}/demandeconge/demandecongescreate`, data)
      .subscribe(
        res => {
          console.log(res);
          this.toastr.success('Demande créée.', 'Success');
          this.router.navigateByUrl('/conge');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
        }
      );
  }
}
