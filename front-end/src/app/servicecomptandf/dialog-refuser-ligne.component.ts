import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { ServicecomptaService } from '../servicecompta/servicecompta.service';


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-refuser-ligne.html',
  styleUrls: ['./servicecomptandf.component.css']
})
export class DialogRefuserLigneCompta implements OnInit{

    motifControl = new FormControl('', [Validators.required]);
    _valid: boolean = false;
    constructor(
        public dialogRef: MatDialogRef<DialogRefuserLigneCompta>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private servicecomptaservice : ServicecomptaService) {}
        
    ngOnInit() {
    }

    onChange() {
        if(this.motifControl.value)
            this._valid = true;
        else
            this._valid = false;
    }

    onClick(): void {
        this.data.motif = this.motifControl.value;
        if(this.data.id_ldf != null){
            this.servicecomptaservice
            .refuserAvance({
                id_ldf : this.data.id_ldf, motif : this.motifControl.value,
                id_ndf : this.data.id_ndf
            });
        }
    }
                        
    onNoClick(): void {
        this.dialogRef.close();
    }
}