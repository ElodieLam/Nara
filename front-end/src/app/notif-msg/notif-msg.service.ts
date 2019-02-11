import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable()
export class NotifMsgService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';
  
   
  getDemCongeFromIdNotif(data){
    return this 
      .http
      .get(`${this.url}/notifMsg/demConge`, { params : data });
  }

  getNdfFromIdNotif(data){
    return this 
      .http
      .get(`${this.url}/notifMsg/ndf`, { params : data });
  }

}