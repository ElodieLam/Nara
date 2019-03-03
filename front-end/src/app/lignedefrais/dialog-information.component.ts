import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ILignedefrais } from './lignedefrais.interface';


@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: './dialog-information.html',
    styleUrls: ['./lignedefrais.component.css']
  })
  export class DialogInformation implements OnInit{
  
    ldf:ILignedefrais;
    noF:boolean = false;
    noCds:boolean = false;
    constructor(
      public dialogRef: MatDialogRef<DialogInformation>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}
     
    ngOnInit() {
        this.ldf = this.data.element;
        if(this.ldf.status == 'Avance refusée CDS' || this.ldf.status == 'Refusée CDS')
            this.noCds = true;
        if(this.ldf.status == 'Avance refusée Compta' || this.ldf.status == 'Refusée Compta')
            this.noF = true;

    }

    onClick(): void {
        this.dialogRef.close();  
    }
  }