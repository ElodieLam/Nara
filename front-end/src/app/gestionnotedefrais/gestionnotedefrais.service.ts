import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable()

/**
 * Responsable : Alban Descottes
 * Service pour les appels serveur pour la partie gestion de note de frais accessible au chef de service
 */
export class GestionnotedefraisService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';
  
  /**
   * Méthode qui renvoie les notes de frais qui sont en commun avec l'id du chef de service
   * Cela donne les notes de frais qui présentent des lignes/avances correspondantes aux 
   * missions du chef de service
   */
  getNotedefraisFromIdCds(data){
      return this 
          .http
          .get(`${this.url}/gestionndf/getndfidcds`, { params : data });
  }

  /**
   * Méthode qui renvoie les lignes de frais et avances correspondantes à l'id de la note de frais
   * Cela ne retourne que les lignes/avances qui correspondent aux missions du cds
   */
  getLignesdefraisFromIdNdfIdCds(data){
      return this
          .http  
          .get(`${this.url}/gestionndf/getldfidndfidcds`, { params : data });
  }

  /**
   * Méthode qui accepte toutes les lignes de frais d'une note de frais
   * Cette méthode met à jour la notification du chef de service et du service compta
   */
  accepterNotedefrais(data) {
    this.http.post(`${this.url}/gestionndf/accepternotedefrais`, data)
      .subscribe(
        res => {
          this.toastr.success('Notif from compta avance ref.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
    );
  }

  /**
   * Méthode qui change le statut des lignes de frais "en attente cds" à "non envoyée"
   * Cette méthode change aussi la notification du chef de service
   */
  renvoyerNotedefrais(data) {
    this.http.post(`${this.url}/gestionndf/renvoyernotedefrais`, data)
      .subscribe(
        res => {
          this.toastr.success('Notif from compta avance ref.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
    );
  }

  /**
   * Méthode qui permet de refuser une ligne de frais
   * Cette méthode envoie une notification au collaborateur pour lui indiquer le refus
   */
  refuserLignedefrais(data) {
    this.http.post(`${this.url}/gestionndf/refuserlignedefrais`, data)
      .subscribe(
        res => {
          this.toastr.success('Notif from compta avance ref.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
    );
  }

  /**
   * Méthode qui change le statut d'une demande d'avance
   * Cette méthode envoie une notification au collaborateur
   */
  refuserAvance(data) {
    this.http.post(`${this.url}/gestionndf/refuseravance`, data)
      .subscribe(
        res => {
          this.toastr.success('Notif from compta avance ref.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
    );
  }

  /**
   * Méthode qui change le statut d'une demande d'avance
   * Cette méthode envoie une notification au service compta
   */
  accepterAvance(data) {
    this.http.post(`${this.url}/gestionndf/accepteravance`, data)
      .subscribe(
        res => {
          this.toastr.success('Notif from compta avance ref.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
    );
  }

  /**
   * Méthode qui change le statut de toutes les demandes d'avance
   * Cette méthode envoie une notification au collaborateur
   */
  accepterAllAvance(data) {
    this.http.post(`${this.url}/gestionndf/accepterallavance`, data)
      .subscribe(
        res => {
          this.toastr.success('Notif from compta avance ref.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
    );
  }

  /**
   * Méthode qui change le statut de toutes les demandes d'avance
   * Cette méthode envoie une notification au collaborateur
   */
  refuserAllAvance(data) {
    this.http.post(`${this.url}/gestionndf/refuserallavance`, data)
      .subscribe(
        res => {
          this.toastr.success('Notif from compta avance ref.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
    );
  }
}
