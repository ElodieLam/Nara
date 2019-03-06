import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

/**
 * Responsable: E.LAM, A.Descottes
 * Service implémentant les requêtes qui récupèrent les données des notifications dans la base de données 
 */
@Injectable()
export class NotifService {
  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) {}
    url = 'http://localhost:3000';
  
    /**
     * Méthode permettant de récupérer les informations de la notification à partir de l'id du collaborateur
     * @param data 
     */
  getNotifCollab(data){
    return this 
      .http
      .get(`${this.url}/notif/notifcollab`, { params : data });
  }

  /**
     * Méthode permettant de récupérer les informations de la notification à partir de l'id et du service du collaborateur
     * @param data 
     */
  getNotifFromIdCollabAndIdService(data){
    return this 
      .http
      .get(`${this.url}/notif/notifservice`, { params : data });
  }
}