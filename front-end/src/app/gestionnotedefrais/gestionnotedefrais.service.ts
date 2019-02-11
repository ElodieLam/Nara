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

}