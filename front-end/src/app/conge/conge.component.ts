import { Component, OnInit, ViewChild } from '@angular/core';
import {IConge} from './conge.interface'
import { CongeService } from './conge.service';

import {Router} from "@angular/router";
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material';
import { CreateDemandecongeComponent } from '../create-demandeconge/create-demandeconge.component';


/**
 * Responsable : Mohamed Beldi, accessible à tous les collaborateurs
 * Component contenant uniquement le tableau où sont inscrites les informations sur les congés du collaborateur
 * Il sert aussi à héberger le component contenant le calendrier avec les différentes demandes de congés
 * 
 */

@Component({
  selector: 'app-conge',
  templateUrl: './conge.component.html',
  styleUrls: ['./conge.component.css']
})
export class CongeComponent implements OnInit 
{
  infoConges : IConge[]
  user = 0;
  isCds = false;
  transmettre = [this.user, this.isCds] //sert à transmettre les informations sur l'utilisateur et s'il est CdS au component create-demande
  dataSource;

  /**Dans le constructeur on récupère l'id du collaborateur et s'il est CdS depuis le component de login */
  constructor(private congeService: CongeService , private router: Router, private login: LoginComponent,  public dialog: MatDialog) 
  { 
    this.user = this.login.user.id_collab;
    this.isCds = this.login.user.isCDS; 
    this.transmettre = [this.user, this.isCds]
  }

  /**fonction servant à ouvrir le dialog permettant la creation d'une nouvelle demande */
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateDemandecongeComponent, {data: this.transmettre});
  }

  /**À l'initialisation on récupère uniquement les informations sur congés du collaborateur connecté */
  ngOnInit() 
  {
    this.congeService
    .getCongesFromIdCollab({id: this.user})
      .subscribe( (data : IConge[]) => {
      this.infoConges = data;
    });

  }


}
