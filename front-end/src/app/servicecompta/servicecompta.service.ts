import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ServicecomptaService {

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
    url = 'http://192.168.1.20:3000';

    getNotedefraisToCompta(data){
        return this 
            .http
            .get(`${this.url}/servicecompta/getndftocompta`, { params : data });
    }

    getLignesdefraisFromIdNdf(data){
        return this 
            .http
            .get(`${this.url}/servicecompta/getndftocomptaidndf`, { params : data });
    }

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
