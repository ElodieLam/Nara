import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

/**
 * Responsable: E.LAM
 * Service implémentant les requêtes qui récupèrent les données de l'utilisateur lors de la connexion
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
    url = 'http://localhost:3000';

  getUserDetails(param){
    return this
      .http
      .get(`${this.url}/login/loginid`, { params : param });
  }
}
