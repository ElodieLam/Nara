import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import { rootRenderNodes } from '@angular/core/src/view';

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
}
