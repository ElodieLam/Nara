import { Component, OnInit } from '@angular/core';


export interface MissionInterface {
  missionName: string;
  collaborateurs: string;
}
const ELEMENT_DATA: MissionInterface[] = [
  {missionName: "Mission MBDA", collaborateurs: 'Hydrogen'},
  {missionName: "Mission Thales", collaborateurs: 'Helium'},
  {missionName: "Mission Amazon", collaborateurs: 'Lithium'},
  {missionName: "Mission Fedex", collaborateurs: 'Beryllium'},
];



@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})

export class MissionsComponent {
  displayedColumns: string[] = ['missionName', 'collaborateurs', 'voirButton', 'modifierButton','cloreButton', 'supprimerButton'];
  dataSource = ELEMENT_DATA;
}


