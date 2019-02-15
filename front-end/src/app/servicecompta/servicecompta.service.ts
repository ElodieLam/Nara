import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class ServicecomptaService {

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';

    getNotedefraisToCompta(data){
        return this 
            .http
            .get(`${this.url}/servicecompta/getndftocompta`, { params : data });
    }

    getLignesdefraisFromIdNdf(data){
        return this 
            .http
            .get(`${this.url}/servicecompta/getndftocomptaidndf`, { params : data });
    }

}
