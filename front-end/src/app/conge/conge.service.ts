import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

/**Le Service permet d'implémenter toutes les requêtes qui font un appel serveur */

@Injectable()
export class CongeService 
{
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
    url = 'http://localhost:3000';
  
  /**Fonction permettant d'avoir les informations de congés d'un collaborateur à partir de son id */
  getCongesFromIdCollab(data)
  {
    return this
      .http
      .get(`${this.url}/conge/congesid`, { params : data});
  }
  /**Fonction mettant à jour les informations de congés d'un collaborateur */
  createConges(data)
  {
    return this
      .http
      .post(`${this.url}/conge/congescreate`, data)
      .subscribe(
        res => {
          console.log(res);
          this.toastr.success('Conge créée.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
        }
      );
  }
}
