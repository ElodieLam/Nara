import { Component, OnInit, ViewChild } from '@angular/core';
import {IConge} from './conge.interface'
import { CongeService } from './conge.service';
import {DemandecongeService} from '../demandeconge/demandeconge.service';
import {Router} from "@angular/router";
import { CalendarEvent, DAYS_OF_WEEK } from 'angular-calendar';
import { IDemandeconge } from '../demandeconge/demandeconge.interface';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-conge',
  templateUrl: './conge.component.html',
  styleUrls: ['./conge.component.css']
})
export class CongeComponent implements OnInit 
{
  
  viewDate: Date = new Date();
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  events = [];
  infoConges : IConge[]
  listeDemande : IDemandeconge[];
  test: IConge = {id_collab: 6, rtt_restant: null, rtt_pris: null, cp_pris: null, cp_restant: null, css_pris: null}
  constructor(private congeService: CongeService , private demandecongeService: DemandecongeService, private router: Router) { }
  
  displayedColumn = ['id', 'type', 'datedebut', 'datefin', 'statut', 'duree'];
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource(this.listeDemande); 

  ngOnInit() 
  {
    this.congeService
    .getCongesFromIdCollab(this.test)
      .subscribe( (data : IConge[]) => {
      this.infoConges = data;
    });
    this.demandecongeService
    .getDemandecongesFromIdCollab(this.test)
      .subscribe( (data : IDemandeconge[]) => {
      this.listeDemande = data;
      this.dataSource = new MatTableDataSource(this.listeDemande); 
      this.dataSource.sort = this.sort;
    });

    
    console.log(this.dataSource);
   
  }


}
