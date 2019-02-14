import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
    nomMission: string;
    collaborateurs: string;
  }

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-creer-mission.html',
  })
  export class DialogCreerMission {
    dialogRef: any;
  
    constructor(public dialog: MatDialog) {}
    
    openDialog(): void {
        const dialogRef = this.dialog.open(DialogCreerMission)
        };
  
    onNoClick(): void 
    {
        const dialogRef = this.dialog.open(DialogCreerMission)
        this.dialogRef.close();
    }
  
  }

