import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable()
export class NotedefraisService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';
  
  
  getNotedefraisFromIdCollab(data){
    return this 
      .http
      .get(`${this.url}/notedefrais/notedefraisid`, { params : data });
  }

  getNotedefraisresumeFromIdNdf(data){
    return this
      .http
      .get(`${this.url}/notedefrais/lignesdefraisresumeidndf`, { params : data });
  }

  createNotedefrais(data) {
    this.http.post(`${this.url}/notedefrais/createnotedefrais`, data)
      .subscribe(
        res => {
          this.toastr.success('Note de frais créée.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
        }
      );
  }

  getNotedefraisMonthYear(data){
    return this
      .http
      .get(`${this.url}/notedefrais/getnotedefraismonthyear`, { params : data });
  }
}