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

  createNotedefraisWithMonth(id, month) {
    this.http.post(`${this.url}/notedefrais/notedefraiscreate`, id, month)
      .subscribe(
        res => {
          console.log(res);
          this.toastr.success('Note de frais créée.', 'Success');
          this.router.navigateByUrl('/notedefrais');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
        }
      );
  }
}