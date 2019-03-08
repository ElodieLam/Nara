import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar, MatPaginator } from '@angular/material';
import { MissionService } from './missions.service';
import { Router } from "@angular/router";
import { DialogCreerMission } from './dialog-creer-mission.component';
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

/**
 * Responsable : Djenna Zitouni
 * Component qui représente la gestion des missions pour les chefs de service
 * Accessible pour les chef de service
 */
export class MissionsComponent implements OnInit {

  
infoMissions : MissionInterface[] = []
infoMissions2: MissionInterface[] = []
listeMissions;
listeCollaborateurs;
displayedColumns: string[] = ['nom_mission', 'date_mission', 'voirButton', 'modifierButton','cloreButton', 'supprimerButton'];

@ViewChild(MatPaginator) paginator: MatPaginator;

constructor(private missionService: MissionService , private router: Router,
  public dialog: MatDialog, private login : LoginComponent, private snackBar : MatSnackBar) {}

ngOnInit() 
{
  this.refresh();
}

refresh() {
  this.infoMissions = []
  this.infoMissions2 = []
  this.missionService
  .getMissions({ ouverte : true , id : this.login.user.id_collab })
  .subscribe( (data : MissionInterface[]) => {
    this.infoMissions = data;
    this.infoMissions.forEach( miss => {
      miss.cnt ==  null ? miss.cnt = 0 : {};
    })
    this.infoMissions.forEach(miss => {
      if(miss.id_chef == this.login.user.id_collab)
        this.infoMissions2.push(miss);
    })
    this.listeMissions = new MatTableDataSource<MissionInterface>(this.infoMissions2); 
    this.listeMissions.paginator = this.paginator;  
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
      this.infoMissions = data;
      this.listeMissions = new MatTableDataSource<MissionInterface>(this.infoMissions);

  });
}

supprimerMission(idMission) : void
{
  this.missionService
  .supprimerMission({id : idMission});
  this.delay(1500).then(any => {
    this.refresh();
    this.openSnackBar('Mission supprimée', 750);
  });
}

cloreMission(idMission) : void
{
  this.missionService
  .cloreMission({id : idMission});
  this.delay(1500).then(any => {
    this.refresh();
    this.openSnackBar('Mission clôturée', 750);
  });
}

ouvrirMission(idMission) : void
{
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
  this.snackBar.openFromComponent(SnackBarComponent, {
    duration: duration,
    data : msg
  });
}


}





