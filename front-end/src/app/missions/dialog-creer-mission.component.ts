import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialogRef,  MatTableDataSource, MatPaginator } from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import { MissionService } from './missions.service';
import { FormControl, Validators } from '@angular/forms';


export interface DialogData {
    nomMission: string;
    collaborateurs: string;
  }

  export interface CollaboInterface {
    id_collab: Number;
    nom_collab : string;
    prenom_collab : string;
    nom_service:string;
  }

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-creer-mission.html',
    styleUrls: ['./missions.component.css']
  })

  export class DialogCreerMission implements OnInit{

    
infoCollaborateurs : CollaboInterface[]
listeMissions;
listeCollaborateurs;
displayedColumns: string[] = ['select', 'collab', 'service'];
nomControl = new FormControl('', [Validators.required]);
dateControl = new FormControl('', [Validators.required]);
nomMission : string;
dateMission : Date;


  selection = new SelectionModel<CollaboInterface>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public dialogRef: MatDialogRef<DialogCreerMission>, private missionService : MissionService) {}


    
    ngOnInit() 
    {
        this.missionService
        .getAllCollaborateurs( { } ) 
          .subscribe( (data : CollaboInterface[]) => {
            console.log(data);
          this.infoCollaborateurs = data;
          this.listeCollaborateurs = new MatTableDataSource<CollaboInterface>(this.infoCollaborateurs);
          this.listeCollaborateurs.paginator = this.paginator;
        });

    }

    onChange()
    {
        this.nomMission = this.nomControl.value;
        this.dateMission = this.dateControl.value;

        console.log(this.nomControl.value)
        console.log(this.dateControl.value)


    }
    onClick(): void 
    {

    }

        /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.listeCollaborateurs.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.listeCollaborateurs.data.forEach(row => this.selection.select(row));
    }

    applyFilter(filterValue: string) {
        this.listeCollaborateurs.filter = filterValue.trim().toLowerCase();
      }


    onNoClick(): void 
    {
        this.dialogRef.close();
    }

    
  
  }

