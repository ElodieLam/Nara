import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatDialogRef,  MatTableDataSource, MatPaginator, MAT_DIALOG_DATA } from '@angular/material';
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
valid:boolean = false;


  selection = new SelectionModel<CollaboInterface>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public dialogRef: MatDialogRef<DialogCreerMission>, 
        @Inject(MAT_DIALOG_DATA) public data: any,
        private missionService : MissionService
        ) {}


    
    ngOnInit() 
    {
      this.missionService
      .getAllCollaborateurs( { } ) 
        .subscribe( (data : CollaboInterface[]) => {
        this.infoCollaborateurs = data;
        this.listeCollaborateurs = new MatTableDataSource<CollaboInterface>(this.infoCollaborateurs);
        this.listeCollaborateurs.paginator = this.paginator;
      });
    }

    onChange()
    {
      this.nomMission = this.nomControl.value;
      this.dateMission = this.dateControl.value;
      if(((this.nomMission == null ) ? false : this.nomMission.toString() != '') 
          && ((this.dateMission == null ) ? false : this.dateMission.toString() != '') )
          this.valid = true;
      else    
          this.valid = false;
    }
    onClick(): void 
    {
      var collab = []
      this.selection.selected.forEach( col => {
          collab.unshift(col.id_collab);
      })
      this.missionService
          .createMission({
          id : this.data.id , collab : collab, nom : this.nomMission, date : this.dateMission
      });
    }

    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.listeCollaborateurs.data.length;
      return numSelected === numRows;
    }

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
        this.dialogRef.close(false);
    }
  }

