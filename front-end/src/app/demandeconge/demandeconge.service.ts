import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

/**Le Service permet d'implémenter toutes les requêtes qui font un appel serveur */

@Injectable({
    providedIn: 'root'
}
   
)
export class DemandecongeService 
{
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';
  
  /**Fonction retournant toutes les demandes d'un collaborateur dont l'id est passé en paramètres*/
  getDemandecongesFromIdCollab(data)
  {
    return this
      .http
      .get(`${this.url}/demandeconge/demandecongesid`, { params : data});
  }

  /**Fonction retournant toutes les demandes d'un service à partir du collaborateur dont l'id est passé en paramètres*/
  getDemandecongesServiceFromIdCollab(data) {
    return this
      .http
      .get(`${this.url}/demandeconge/demandecollab`, { params: data });
  }

  /**Fonction supprimant le congé en fonction de son identifiant */
  deleteDemandeconges(data)
  {
    return this
      .http
      .post(`${this.url}/demandeconge/deletedemande`, data)
      .subscribe(
        res => {
          console.log(res);
          this.toastr.success('Demande supprimée.', 'Success');
          this.router.navigateByUrl('/conge');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
        }
      );
  }
  
  /**Fonction créant une demande de congé avec tous les paramètres  */
  createDemandeconges(data)
  {
    return this
      .http
      .post(`${this.url}/demandeconge/demandecongescreate`, data)
      .subscribe(
        res => {
          console.log(res);
          this.toastr.success('Demande créée.', 'Success');
          this.router.navigateByUrl('/conge');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
        }
      );
  }
}
