import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import { MissionsComponent } from './missions.component';


export interface DialogData {
    nomMission: string;
    collaborateurs: string;
  }

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-creer-mission.html',
  })

  export class DialogCreerMission implements OnInit{
    constructor(public dialogRef: MatDialogRef<DialogCreerMission>) {}


    
    ngOnInit() 
    {

    }

    onChange()
    {

    }

    onClick(): void 
    {

    }

    onNoClick(): void 
    {
        this.dialogRef.close();
    }
  
  }

