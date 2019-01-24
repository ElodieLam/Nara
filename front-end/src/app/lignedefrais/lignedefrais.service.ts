import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable()
export class LignedefraisService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';

  getLignesdefraisFromIdNdf(data){
    console.log("service");
    console.log(data);
    return this
      .http
      .get(`${this.url}/lignedefrais/lignesdefraisidndf`, { params : data });
  }

}