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
