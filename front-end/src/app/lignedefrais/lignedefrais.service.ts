import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
          console.log('service ajout');
          console.log(res);
          this.toastr.success('Ligne de frais ajoutée.', 'Success');

        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
        }
      );
  }

}