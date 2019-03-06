import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable()
/**
 * Responsable : Alban Descottes
 * Service pour la gestion des notes de frais du collaborateur
 * Cette page est accessible par tous les collaborateurs
 */
export class NotedefraisService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
    url = 'http://localhost:3000';
  
  /**
   * Méhtode qui retourne toutes les notes de frais du collaborateur
   */
  getNotedefraisFromIdCollab(data){
    return this 
      .http
      .get(`${this.url}/notedefrais/notedefraisid`, { params : data });
  }
  /**
   * Méhtode qui retourne toutes les lignes de frais d'une note de frais
   */
  getNotedefraisresumeFromIdNdf(data){
    return this
      .http
      .get(`${this.url}/notedefrais/lignesdefraisresumeidndf`, { params : data });
  }

  /**
   * Méthode qui crée une nouvelle note de frais pour le collaborateur
   */
  createNotedefrais(data) {
    this.http.post(`${this.url}/notedefrais/createnotedefrais`, data)
      .subscribe(
        res => {
          this.toastr.success('Note de frais créée.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
        }
      );
  }

  /**
   * Méthode qui retourne une note de frais avec l'id du collaborateur, le mois et l'année 
   */
  getNotedefraisMonthYear(data){
    return this
      .http
      .get(`${this.url}/notedefrais/getnotedefraismonthyear`, { params : data });
  }
  /**
   * Méthode qui récupère toutes les notes de frais du collaborateur pour la partie historique
   */
  getNotedefraisHistorique(data) {
    return this
      .http
      .get(`${this.url}/notedefrais/getnotedefraishistorique`, { params : data });
  }
}