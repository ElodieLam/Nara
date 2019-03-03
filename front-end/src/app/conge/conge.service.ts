import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";


@Injectable()
export class CongeService 
{
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
    url = 'http://192.168.1.20:3000';
  
  
  getCongesFromIdCollab(data)
  {
    return this
      .http
      .get(`${this.url}/conge/congesid`, { params : data});
  }

  createConges(data)
  {
    console.log("oh bosetti");
    return this
      .http
      .post(`${this.url}/conge/congescreate`, data)
      .subscribe(
        res => {
          console.log(res);
          this.toastr.success('Conge créée.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
        }
      );
  }
}
