import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable()
export class GestionnotedefraisService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';
  
  
    getNotedefraisFromIdCds(data){
        return this 
            .http
            .get(`${this.url}/gestionndf/getndfidcds`, { params : data });
    }

    getLignesdefraisFromIdNdfIdCds(data){
        return this
            .http  
            .get(`${this.url}/gestionndf/getldfidndfidcds`, { params : data });
    }

    updateStatutLignedefrais(data) {
      this.http.post(`${this.url}/gestionndf/updateldf`, data)
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
      this.http.post(`${this.url}/gestionndf/updateavance`, data)
        .subscribe(
          res => {
          this.toastr.success('Avance modifiée.', 'Success');
  
          },
          err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
      );
    }

    createOrUpdateNotifNdfToComptaGlobal(data) {
      this.http.post(`${this.url}/notifndf/createnotifndftocomptaglobal`, data)
        .subscribe(
          res => {
          this.toastr.success('Notif to compta avance.', 'Success');
  
          },
          err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
      );
    }
    
    createOrUpdateAllNotifications(data) {
      this.http.post(`${this.url}/notifndf/createorupdateallnotifications`, data)
        .subscribe(
          res => {
            console.log('All notifications updated')
            this.toastr.success('Notif from compta avance ref.', 'Success');
          },
          err => {
            console.log('Error occured:' , err);
            this.toastr.error(err.message, 'Error occured');
            }
      );
    }

    /**
     * @param data : id_ldf, motif, stat, id_ndf 
     * @description maj d'une ligne de frais, avec maj de la notif fromCompta : oui / non 
     */
    updateLdfnotifToAndFromCompta(data) {
      this.http.post(`${this.url}/gestionndf/updateldfnotiftoandfromcompta`, data)
        .subscribe(
          res => {
            console.log('maj ldf, maj notif to or from compta')
            this.toastr.success('Notif from compta avance ref.', 'Success');
          },
          err => {
            console.log('Error occured:' , err);
            this.toastr.error(err.message, 'Error occured');
            }
      );
    }

    /**
     * @param data : id_ldf, motif, stat, id_ndf 
     * @description maj d'une avance, avec maj de la notif fromCompta : oui / non 
     */
    updateAvancenotifToAndFromCompta(data) {
      this.http.post(`${this.url}/gestionndf/updateavancenotiftoandfromcompta`, data)
        .subscribe(
          res => {
            console.log('maj avance, maj notif to or from compta')
            this.toastr.success('Notif from compta avance ref.', 'Success');
          },
          err => {
            console.log('Error occured:' , err);
            this.toastr.error(err.message, 'Error occured');
            }
      );
    }

}
