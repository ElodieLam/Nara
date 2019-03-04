import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { MissionService } from './missions.service';
import {Router} from "@angular/router";
import {DialogCreerMission} from './dialog-creer-mission.component';


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

  
infoMissions : MissionInterface[]
listeMissions;
listeCollaborateurs;
displayedColumns: string[] = ['id_mission', 'nom_mission', 'id_chef', 'date_mission', 'voirButton', 'modifierButton','cloreButton', 'supprimerButton'];


constructor(private missionService: MissionService , private router: Router,
  public dialog: MatDialog) {}

ngOnInit() 
{
  this.missionService
  .getMissions({ ouverte : true })
    .subscribe( (data : MissionInterface[]) => {
      console.log(data);
      this.infoMissions = data;
    this.listeMissions = new MatTableDataSource<MissionInterface>(this.infoMissions);

  });

}

openDialogCreerMission(): void 
{
  const dialogRef = this.dialog.open(DialogCreerMission, {
    width: '500px'
  });
  
  
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
}

switchMissions(month) : void
{
  this.missionService
  .getMissionsByMonth({ mois : month })
    .subscribe( (data : MissionInterface[]) => {
      console.log(data);
      this.infoMissions = data;
    this.listeMissions = new MatTableDataSource<MissionInterface>(this.infoMissions);

  });
}


  


}





