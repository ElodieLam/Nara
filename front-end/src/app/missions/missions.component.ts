import { Component, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MissionService } from './missions.service';
import {Router} from "@angular/router";


export interface MissionInterface {
  id_mission : number;
  id_chef : number;
  nom_mission: string;
  date_mission: string;
  ouverte : number;
  mois : number;
}

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})

export class MissionsComponent implements OnInit {

months = [
  { name: "Janvier", value: 1 },
  { name: "Février", value: 2 },
  { name: "Mars", value: 3 },
  { name: "Avril", value: 4 },
  { name: "Mai", value: 5 },
  { name: "Juin", value: 6 },
  { name: "Juillet", value: 7 },
  { name: "Août", value: 8 },
  { name: "Septembre", value: 9 },
  { name: "Octobre", value: 10 },
  { name: "Novembre", value: 11 },
  { name: "Décembre", value: 12 },]
  

infoMissions : MissionInterface[]
dataSource;



constructor(private missionService: MissionService , private router: Router) {}

ngOnInit() 
{
  this.missionService
  .getMissions({ ouverte : true })
    .subscribe( (data : MissionInterface[]) => {
      console.log(data);
      this.infoMissions = data;
    this.dataSource = new MatTableDataSource<MissionInterface>(this.infoMissions);

  });

}

switchMissions(month) : void
{
  this.months = month; 
  this.missionService
  .getMissionsByMonth({ mois : month })
    .subscribe( (data : MissionInterface[]) => {
      console.log(data);
      this.infoMissions = data;
    this.dataSource = new MatTableDataSource<MissionInterface>(this.infoMissions);

  });
}

  displayedColumns: string[] = ['id_mission', 'nom_mission', 'id_chef', 'date_mission', 'voirButton', 'modifierButton','cloreButton', 'supprimerButton'];
}


