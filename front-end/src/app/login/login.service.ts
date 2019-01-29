import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

import {environment} from "../../environments/environment";
import {map} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';


  getUserDetails(data){
    return this
      .http
      .get(`${this.url}/login/loginid`, { params : data});
  }
}
