import { Component, OnInit } from '@angular/core';
import {IConge} from './conge.interface'
import { CongeService } from './conge.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-conge',
  templateUrl: './conge.component.html',
  styleUrls: ['./conge.component.css']
})
export class CongeComponent implements OnInit 
{
  infoConges : IConge[]
  test: IConge = {id_collab: 6, rtt_restant: null, rtt_pris: null, cp_pris: null, cp_restant: null, css_pris: null}
  constructor(private congeService: CongeService , private router: Router) { }

  ngOnInit() 
  {
    this.congeService
    .getCongesFromIdCollab(this.test)
      .subscribe( (data : IConge[]) => {
      this.infoConges = data;
    });
  }

}
