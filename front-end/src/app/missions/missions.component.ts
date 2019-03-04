import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { MissionService } from './missions.service';
import {Router} from "@angular/router";
import {DialogCreerMission} from './dialog-creer-mission.component';
import { LoginComponent } from '../login/login.component';
import { SnackBarComponent } from '../lignedefrais/lignedefrais.component';


export interface MissionInterface {
  id_mission : number;
  id_chef : number;
  nom_mission: string;
  date_mission: string;
  ouverte : number;
  cnt:number;
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
  public dialog: MatDialog, private login : LoginComponent, private snackBar : MatSnackBar) {}

ngOnInit() 
{
  this.refresh();
  
}

refresh() {

  this.missionService
  .getMissions({ ouverte : true , id : this.login.user.id_collab })
  .subscribe( (data : MissionInterface[]) => {
    console.log(data)
    this.infoMissions = data;
    this.infoMissions.forEach( miss => {
      miss.cnt ==  null ? miss.cnt = 0 : {};
    })
    this.listeMissions = new MatTableDataSource<MissionInterface>(this.infoMissions);   
  });
}

openDialogCreerMission(): void 
{
  const dialogRef = this.dialog.open(DialogCreerMission, {
    width: '500px', data: {id : this.login.user.id_collab}
  });
  
  
  dialogRef.afterClosed().subscribe(result => {
    if(result) {
      this.delay(1500).then(any => {
        this.refresh();
        this.openSnackBar('Mission créée', 750);
      });
    }
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

supprimerMission(idMission) : void
{
  console.log(idMission);
  this.missionService
  .supprimerMission({id : idMission});
  this.delay(1500).then(any => {
    this.refresh();
    this.openSnackBar('Mission supprimée', 750);
  });
}

cloreMission(idMission) : void
{
  console.log(idMission);
  this.missionService
  .cloreMission({id : idMission});
  this.delay(1500).then(any => {
    this.refresh();
    this.openSnackBar('Mission clôturée', 750);
  });
}

ouvrirMission(idMission) : void
{
  console.log(idMission);
  this.missionService
  .ouvrirMission({id : idMission});
  this.delay(1500).then(any => {
    this.refresh();
    this.openSnackBar('Mission ouverte', 750);
  });
}

async delay(ms: number) {
  await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
}


openSnackBar(msg: string, duration : number) {
  console.log('snack')
  this.snackBar.openFromComponent(SnackBarComponent, {
    duration: duration,
    data : msg
  });
}


}





