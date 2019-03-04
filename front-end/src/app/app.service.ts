import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';

    updateApp() {
      this.http.post(`${this.url}/application/updateapp`, {})
          .subscribe(
              res => {
              console.log("succes")
              this.toastr.success('Ligne de frais modifiée.', 'Success');
  
              },
              err => {
              console.log('Error occured:' , err);
              this.toastr.error(err.message, 'Error occured');
              }
          );
    }
}
