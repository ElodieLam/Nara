import { Component, OnInit } from '@angular/core';
import { DemandecongeService } from './demandeconge.service';
import {Router} from "@angular/router";
import { IDemandeconge } from './demandeconge.interface';

@Component({
  selector: 'app-demandeconge',
  templateUrl: './demandeconge.component.html',
  styleUrls: ['./demandeconge.component.css']
})
export class DemandecongeComponent implements OnInit 
{
  
  listeDemande: IDemandeconge[];
  constructor(private demandecongeService: DemandecongeService , private router: Router) { }

  ngOnInit() {
  }

}
