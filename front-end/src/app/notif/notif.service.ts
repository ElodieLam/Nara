import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable()
export class NotifService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) {}
    url = 'http://192.168.1.20:3000';
  
  getNotifCollab(data){
    return this 
      .http
      .get(`${this.url}/notif/notifcollab`, { params : data });
  }

  getNotifFromIdCollabAndIdService(data){
    return this 
      .http
      .get(`${this.url}/notif/notifservice`, { params : data });
  }
}