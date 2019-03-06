import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Injectable()

/**
 * Responsable : Alban Descottes
 * Service pour les appels serveur pour la partie gestion des lignes de frais accessible au collaborateur
 */
export class LignedefraisService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
    url = 'http://localhost:3000';

  /**
   * Méthode qui retourne toutes les lignes de frais et avances avec l'id de la note de frais
   */
  getLignesdefraisFromIdNdf(data){
    return this
      .http
      .get(`${this.url}/lignedefrais/lignesdefraisidndf`, { params : data });
  }

  /**
   * Méthode qui retourne toutes les missions possibles pour ajouter une ligne de frais
   * Cette méthode prend en compte l'id du collaborateur et si les missions sont disponibles
   */
  getMissionsCollabLignedefrais(data){
    return this
      .http
      .get(`${this.url}/lignedefrais/missionscollabldf`, { params : data });
  }

  /**
   * Méthode qui retourne toutes les missions possibles pour demander des avances
   * Cette méthode prend en compte l'id du collaborateur et si les missions sont disponibles
   */
  getMissionsCollabAvance(data){
    return this
      .http
      .get(`${this.url}/lignedefrais/missionscollabavance`, { params : data });
  }

  /**
   * Méthode qui ajoute une ligne de frais
   */
  createLignedefrais(data) {
    this.http.post(`${this.url}/lignedefrais/ajoutlignedefrais`, data)
      .subscribe(
        res => {
        this.toastr.success('Ligne de frais ajoutée.', 'Success');

        },
        err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
        }
      );
  }

  /**
   * Méthode qui ajoute une demande d'avance
   */
  createAvance(data) {
    this.http.post(`${this.url}/lignedefrais/ajoutavance`, data)
      .subscribe(
        res => {
        this.toastr.success('Demande d\'avance ajoutée.', 'Success');

        },
        err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
        }
      );
  }

  /**
   * Méthode qui supprime une ligne de frais
   */
  deleteLignedefrais(data) {
      
    this.http.post(`${this.url}/lignedefrais/supprlignedefrais`, data)
        .subscribe(
            res => {
            this.toastr.success('Ligne de frais supprimée.', 'Success');

            },
            err => {
            console.log('Error occured:' , err);
            this.toastr.error(err.message, 'Error occured');
            }
        );
  }


  /**
   * Méthode qui modifie une ligne de frais
   */
  updateLignedefrais(data) {
    this.http.post(`${this.url}/lignedefrais/updatelignedefrais`, data)
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
   * Méthode qui modifie une avance
   */
  updateLignedefraisAvance(data) {
    this.http.post(`${this.url}/lignedefrais/updatelignedefraisavance`, data)
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
   * Méthode qui supprime une avance
   */
  deleteAvance(data) {
    this.http.post(`${this.url}/lignedefrais/suppravance`, data)
      .subscribe(
        res => {
        this.toastr.success('Avance supprimée.', 'Success');

        },
        err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
        }
      );
  }

  /**
   * Méthode qui crée les notifications pour les chef de services des missions ou le service compta
   * Cette méthode est appelée lorsque l'utilisateur envoie la note de frais ou les avances
   */
  updateLignedefraisGlobal(data) {
    this.http.post(`${this.url}/lignedefrais/updatelignedefraisglobal`, data)
      .subscribe(
        res => {
        this.toastr.success('global success.', 'Success');

        },
        err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
        }
      );
    }

  /**
   * Méthode qui annule l'envoi de la note de frais du collaborateur
   * Cette méthode supprime les notifications qui ont été créés
   */
  cancelSending(data) {
    this.http.post(`${this.url}/lignedefrais/cancelsending`, data)
      .subscribe(
        res => {
        this.toastr.success('global success.', 'Success');

        },
        err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
        }
      );
    }
    
}