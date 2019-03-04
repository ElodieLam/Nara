import { Component, OnInit, ViewChild } from '@angular/core';
import {IConge} from './conge.interface'
import { CongeService } from './conge.service';

import {Router} from "@angular/router";
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material';
import { CreateDemandecongeComponent } from '../create-demandeconge/create-demandeconge.component';




@Component({
  selector: 'app-conge',
  templateUrl: './conge.component.html',
  styleUrls: ['./conge.component.css']
})
export class CongeComponent implements OnInit 
{
  infoConges : IConge[]
  test: IConge = {id_collab: 6, rtt_restant: null, rtt_pris: null, cp_pris: null, cp_restant: null, css_pris: null}
  user = 0;
  isCds = false;
  transmettre = [this.user, this.isCds]
  dataSource;

  constructor(private congeService: CongeService , private router: Router, private login: LoginComponent,  public dialog: MatDialog) 
  { 
    this.user = this.login.user.id_collab;
    this.isCds = this.login.user.isCDS == null ? false : true; 
    this.transmettre = [this.user, this.isCds]
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateDemandecongeComponent, {data: this.transmettre});
  }

  ngOnInit() 
  {
    this.congeService
    .getCongesFromIdCollab({id: this.user})
      .subscribe( (data : IConge[]) => {
      this.infoConges = data;
    });

  }


}
