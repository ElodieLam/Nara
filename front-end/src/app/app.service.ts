import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})

/**
 * Service pour les mises à jours gobales des demandes d'avances de l'application
 */
export class AppService {

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';

  /**
   * Supprime les demandes d'avances qui ne sont pas validées après la date de la mission
   * Décale les demandes d'avances en attente
   */
  updateApp() {
    this.http.post(`${this.url}/application/updateapp`, {})
        .subscribe(
            res => {
            this.toastr.success('Ligne de frais modifiée.', 'Success');

            },
            err => {
            console.log('Error occured:' , err);
            this.toastr.error(err.message, 'Error occured');
            }
        );
  }
}
