import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { GestionnotedefraisService } from '../gestionnotedefrais/gestionnotedefrais.service';


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-refuser-ligne.html',
  styleUrls: ['./gestionlignedefrais.component.css']
})
export class DialogRefuserLigne implements OnInit{

    motifControl = new FormControl('', [Validators.required]);
    _valid: boolean = false;
    constructor(
        public dialogRef: MatDialogRef<DialogRefuserLigne>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private gestionnotedefraisService : GestionnotedefraisService) {}
        
    ngOnInit() {
    }

    onChange() {
        if(this.motifControl.value)
            this._valid = true;
        else
            this._valid = false;
    }

    onClick(): void {
        var statut = 0;
        if(this.data.statut == 'avattCds') 
            statut = 4;
        else
            statut = 9;
        if(this.data.avance) {
            this.gestionnotedefraisService.refuserAvance({
                id_ldf : this.data.id, motif : this.motifControl.value, statut : statut,
                id_cds : this.data.id_cds, id_ndf : this.data.id_ndf
            })
        }
        else {
            this.gestionnotedefraisService.refuserLignedefrais({
                id_ldf : this.data.id, motif : this.motifControl.value, statut : statut
            })
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}