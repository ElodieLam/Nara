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

    createOrUpdateNotifNdfToCompta(data) {
      this.http.post(`${this.url}/notifndf/createnotifndftocompta`, data)
        .subscribe(
          res => {
          this.toastr.success('Notif to compta.', 'Success');
  
          },
          err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
      );
    }

    createOrUpdateNotifNdfToComptaAvance(data) {
      this.http.post(`${this.url}/notifndf/createnotifndftocomptaavance`, data)
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
    
    createOrUpdateNotifNdfFromComptaAcceptee(data) {
      this.http.post(`${this.url}/notifndf/createnotifndffromcomptaacc`, data)
        .subscribe(
          res => {
          this.toastr.success('Notif from compta acc.', 'Success');
  
          },
          err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
      );
    }

    createOrUpdateNotifNdfFromComptaRefusee(data) {
      this.http.post(`${this.url}/notifndf/createnotifndffromcomptaref`, data)
        .subscribe(
          res => {
          this.toastr.success('Notif from compta ref.', 'Success');
  
          },
          err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
      );
    }
    
    createOrUpdateNotifNdfFromComptaAvanceAcceptee(data) {
      this.http.post(`${this.url}/notifndf/createnotifndffromcomptaavanceacc`, data)
        .subscribe(
          res => {
          this.toastr.success('Notif from compta avance acc.', 'Success');
  
          },
          err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
          }
      );
    }

    createOrUpdateNotifNdfFromComptaAvanceRefusee(data) {
      this.http.post(`${this.url}/notifndf/createnotifndffromcomptaavanceref`, data)
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

}
