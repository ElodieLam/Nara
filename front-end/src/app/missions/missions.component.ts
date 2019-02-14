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
}

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})

export class MissionsComponent implements OnInit {


infoMissions : MissionInterface[]
test: MissionInterface = {id_mission: null, id_chef: null, nom_mission: null, date_mission: null, ouverte: 1}
dataSource;

 ELEMENT_DATA: MissionInterface[] = [
  {id_mission:2, id_chef: 4, nom_mission: "Mission MBDA", date_mission: "test", ouverte : 1},
  {id_mission:2, id_chef: 4, nom_mission: "Mission MBDA", date_mission: "test", ouverte : 1}
];


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
  displayedColumns: string[] = ['id_mission', 'nom_mission', 'id_chef', 'date_mission', 'voirButton', 'modifierButton','cloreButton', 'supprimerButton'];
}


