import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable()
export class NotifService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';
  
  
  //Chef de service
  getNotifDemCongeFromIdCds(data){
    return this 
      .http
      .get(`${this.url}/notif/demCongeService`, { params : data });
  }

  getNotifNdfFromIdCds(data){
    return this 
      .http
      .get(`${this.url}/notif/ndfService`, { params : data });
  }

  //Utilisateur simple
  getNotifDemCongeFromId(data){
    return this 
      .http
      .get(`${this.url}/notif/demConge`, { params : data });
  }

  getNotifNdfFromId(data){
    return this 
      .http
      .get(`${this.url}/notif/ndf`, { params : data });
  }
}