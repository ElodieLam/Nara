import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Injectable()
export class LignedefraisService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
    url = 'http://localhost:3000';

  getLignesdefraisFromIdNdf(data){
    console.log('service refresh')
    return this
      .http
      .get(`${this.url}/lignedefrais/lignesdefraisidndf`, { params : data });
  }

  getMissionsCollabLignedefrais(data){
    return this
      .http
      .get(`${this.url}/lignedefrais/missionscollabldf`, { params : data });
  }

  getMissionsCollabAvance(data){
    return this
      .http
      .get(`${this.url}/lignedefrais/missionscollabavance`, { params : data });
  }

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
     * @param data : id_ndf, id_mission, libelle, montant, commentaire 
     * @description creation d'une ligne de frais avance 
     */
  createAvance(data) {
    this.http.post(`${this.url}/lignedefrais/ajoutavance`, data)
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

  updateLignedefrais(data) {
    this.http.post(`${this.url}/lignedefrais/updatelignedefrais`, data)
        .subscribe(
            res => {
            //this.ldf.refreshLignesdefrais();
            // console.log('service suppr');
            // console.log(res);
            this.toastr.success('Ligne de frais modifiée.', 'Success');

            },
            err => {
            console.log('Error occured:' , err);
            this.toastr.error(err.message, 'Error occured');
            }
        );
  }

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

  updateLignedefraisGlobal(data) {
    this.http.post(`${this.url}/lignedefrais/updatelignedefraisglobal`, data)
      .subscribe(
        res => {
        console.log('Update global');
        // console.log(res);
        this.toastr.success('global success.', 'Success');

        },
        err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
        }
      );
    }

  cancelSending(data) {
    this.http.post(`${this.url}/lignedefrais/cancelsending`, data)
      .subscribe(
        res => {
        // console.log(res);
        this.toastr.success('global success.', 'Success');

        },
        err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
        }
      );
    }
    
}