import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ServicecomptaService } from '../servicecompta/servicecompta.service';


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-accepter-avance.html',
  styleUrls: ['./servicecomptandf.component.css']
})
export class DialogAccepterAvanceCompta implements OnInit{

    constructor(
        public dialogRef: MatDialogRef<DialogAccepterAvanceCompta>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private servicecomptaservice : ServicecomptaService) {}
        
    ngOnInit() {
    }


    onClick(): void {
        this.servicecomptaservice
        .accepterAvance({
          id_ldf : this.data.id_ldf, id_ndf : this.data.id_ndf, newNdf : this.data.newNdf, 
          newMonth : this.data.newMonth, newYear : this.data.newYear, nom_collab : this.data.nom_collab
        })
    }
                        
    onNoClick(): void {
        this.dialogRef.close();
    }
}
