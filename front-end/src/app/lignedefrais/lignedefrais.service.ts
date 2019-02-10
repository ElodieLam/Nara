import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Injectable()
export class LignedefraisService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';

  getLignesdefraisFromIdNdf(data){
    //console.log("service");
    //console.log(data);
    console.log('service refresh')
    return this
      .http
      .get(`${this.url}/lignedefrais/lignesdefraisidndf`, { params : data });
  }

  getMissionsFromIdCollab(data){
    //console.log("service");
    //console.log(data);
    return this
      .http
      .get(`${this.url}/lignedefrais/missionsidcollab`, { params : data });
  }

  createLignedefrais(data) {
    this.http.post(`${this.url}/lignedefrais/ajoutlignedefrais`, data)
      .subscribe(
        res => {
        //this.ldf.refreshLignesdefrais();
        // console.log('service ajout');
        // console.log(res);
        this.toastr.success('Ligne de frais ajoutée.', 'Success');

        },
        err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
        }
      );
  }

  deleteLignedefrais(data) {
      
    this.http.delete(`${this.url}/lignedefrais/supprlignedefrais/${data.id}`)
        .subscribe(
            res => {
            //this.ldf.refreshLignesdefrais();
            // console.log('service suppr ldf');
            // console.log(res);
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

  createAvance(data) {
    this.http.post(`${this.url}/lignedefrais/ajoutavance`, data)
      .subscribe(
        res => {
        //this.ldf.refreshLignesdefrais();
        //console.log('service ajout avance');
        // console.log(res);
        this.toastr.success('Avance ajoutée.', 'Success');

        },
        err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
        }
      );
  }

  deleteAvance(data) {
    this.http.delete(`${this.url}/lignedefrais/suppravance/${data.id}`)
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

  updateStatutLignedefrais(data) {
    this.http.post(`${this.url}/lignedefrais/updatestatutlignedefrais`, data)
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
  updateStatutAvance(data) {
    this.http.post(`${this.url}/lignedefrais/updatestatutavance`, data)
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

  createOrUpdateNotifNdf(data) {
    this.http.post(`${this.url}/notifndf/createorupdatenotifndf`, data)
      .subscribe(
        res => {
        console.log('service create notif');
        // console.log(res);
        this.toastr.success('Avance ajoutée.', 'Success');

        },
        err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
        }
      );
  }

  createOrUpdateNotifNdfAvance(data) {
    this.http.post(`${this.url}/notifndf/createorupdatenotifndfavance`, data)
      .subscribe(
        res => {
        console.log('service create notif');
        // console.log(res);
        this.toastr.success('Avance ajoutée.', 'Success');

        },
        err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
        }
      );
  }
  createorupdatenotifndfavance
}