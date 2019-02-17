import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { GestionnotedefraisService } from '../gestionnotedefrais/gestionnotedefrais.service';


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
        if(this.data.avance && this.data.statut == 'avattF') 
            statut = 5;
        else
            statut = 10;
        if(this.data.avance) {
            console.log('refuser avance ' + statut)
            // this.gestionnotedefraisService.updateStatutAvance(
            //     { id : this.data.id , motif : this.motifControl.value, statut : stat }
            // );
            this.gestionnotedefraisService.updateAvancenotifToAndFromCompta({
                id_ldf : this.data.id, motif : this.motifControl.value,
                stat : statut, id_ndf : this.data.id_ndf, id_cds : 0
            })
        }
        else {
            console.log('refuser ldf ' + statut)
            this.gestionnotedefraisService.updateLdfnotifToAndFromCompta({
                id_ldf : this.data.id, motif : this.motifControl.value,
                stat : statut, id_ndf : this.data.id_ndf, id_cds : 0
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