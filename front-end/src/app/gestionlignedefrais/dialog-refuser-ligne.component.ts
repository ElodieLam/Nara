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
        console.log(this.data.statut)
        if(this.data.avance && this.data.statut == 'avattCds') 
            statut = 4;
        else
            statut = 9;
        if(this.data.avance) {
            console.log('refuser avance ' + statut)
            // this.gestionnotedefraisService.updateStatutAvance(
            //     { id : this.data.id , motif : this.motifControl.value, statut : stat }
            // );
            this.gestionnotedefraisService.updateAvancenotifToAndFromCompta( {
                id_ndf : this.data.id_ndf, motif : this.motifControl.value,
                 stat : statut, id_ldf : this.data.id 
            });
        }
        else {
            console.log('refuser ldf statut ' + statut)
            this.gestionnotedefraisService.updateLdfnotifToAndFromCompta({
                id_ldf : this.data.id, motif : this.motifControl.value,
                stat : statut, id_ndf : this.data.id_ndf
            })
            // this.gestionnotedefraisService.updateStatutLignedefrais(
            //     { id : this.data.id, motif : this.motifControl.value, statut : stat }
            // );
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}