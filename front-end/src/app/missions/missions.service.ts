import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Injectable()
export class MissionService 
{
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) { }
  url = 'http://localhost:3000';

  getMissions(data){
    return this
      .http
      .get(`${this.url}/missions/missionsid`, { params : data });
  }

  getMissionsByMonth(data){
    return this
      .http
      .get(`${this.url}/missions/missionsidmonths`, { params : data });
  }

  getAllCollaborateurs(data){
    return this
      .http
      .get(`${this.url}/missions/collaborateurs`, { params : data });
  }

  createMission(data) {
    this.http.post(`${this.url}/missions/createmission`, data)
      .subscribe(
        res => {
          this.toastr.success('Mission créée.', 'Success');
        },
        err => {
          console.log('Error occured:' , err);
          this.toastr.error(err.message, 'Error occured');
        }
      );
  }

  supprimerMission(data)
  {
    this.http.post(`${this.url}/missions/supprimermission`, data)
    .subscribe(
      res => {
        this.toastr.success('Mission supprimée.', 'Success');
      },
      err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
      }
    );
  }

  cloreMission(data)
  {
    this.http.post(`${this.url}/missions/cloremission`, data)
    .subscribe(
      res => {
        this.toastr.success('Mission fermée.', 'Success');
      },
      err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
      }
    );
  }

  ouvrirMission(data)
  {
    this.http.post(`${this.url}/missions/ouvrirmission`, data)
    .subscribe(
      res => {
        this.toastr.success('Mission ouverte.', 'Success');
      },
      err => {
        console.log('Error occured:' , err);
        this.toastr.error(err.message, 'Error occured');
      }
    );
  }

}

