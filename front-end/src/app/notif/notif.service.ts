import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable()
export class NotifService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';
  
   
  getNotifDemCongeFromIdCollab(data){
    console.log("Service " + data);
    return this 
      .http
      .get(`${this.url}/notif/demConge`, { params : data });
  }

  getNotifModCongeFromIdCollab(data){
    return this
      .http
      .get(`${this.url}/notif/modConge`, { params : data });
  }

  getNotifNdfFromIdCollab(data) {
    return this
      .http
      .get(`${this.url}/notif/ndf`, { params : data });
  }
}