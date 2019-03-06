import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
/**
 * Responsable : Alban Descottes
 * Service pour la gestion des notes de frais du service compta
 */
export class ServicecomptaService {

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
    url = 'http://localhost:3000';

    /**
     * Méthode qui récupère toutes les notes de frais pour la compta
     */
    getNotedefraisToCompta(data){
        return this 
            .http
            .get(`${this.url}/servicecompta/getndftocompta`, { params : data });
    }

    /**
     * Méthode qui retourne toutes les lignes et avances d'une note de frais
     */
    getLignesdefraisFromIdNdf(data){
        return this 
            .http
            .get(`${this.url}/servicecompta/getndftocomptaidndf`, { params : data });
    }

    /**
     * Méthode qui permet d'accepter toute la note de frais
     * Cette méthode crée une notification pour le collaborateur
     */
    accepterLignes(data) {
      this.http.post(`${this.url}/servicecompta/accepterlignes`, data)
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

    /**
     * Méthode qui permet de refuser toute la note de frais
     * Cette méthode crée une notification pour le collaborateur
     */
    refuserLignes(data) {
      this.http.post(`${this.url}/servicecompta/refuserlignes`, data)
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

    /**
     * Méthode qui permet d'accepter une avance
     * Cette méthode crée une notification pour le collaborateur
     */
    accepterAvance(data) {
      this.http.post(`${this.url}/servicecompta/accepteravance`, data)
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

    /**
     * Méthode qui permet de refuser une avance
     * Cette méthode crée une notification pour le collaborateur
     */
    refuserAvance(data) {
      this.http.post(`${this.url}/servicecompta/refuseravance`, data)
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
