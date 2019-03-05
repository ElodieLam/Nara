import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import { rootRenderNodes } from '@angular/core/src/view';

@Injectable({
    providedIn: 'root'
}
   
)
export class GestioncongeService 
{
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';
  
  
  getDemandecongesFromIdCdS(data)
  {
    return this
      .http
      .get(`${this.url}/demandeconge/demandeservice`, { params : data});
  }

  getCollabs()
  {
    return this
      .http
      .get(`${this.url}/collaborateur/collab`);
  }

  getInfoCollab(data)
  {
    return this
      .http
      .get(`${this.url}/collaborateur/infocollab`, { params : data});
  }

  updateService(data)
  {
    return this
      .http
      .post(`${this.url}/demandeconge/updateservice`, data)
      .subscribe(
        res => {
          console.log(res);
          this.toastr.success('Demande gérée.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
        }
      );
  }
}
