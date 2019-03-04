import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LignedefraisService } from './lignedefrais.service';
import { ILibelle, IMission, IMissionOld } from './lignedefrais.interface';
import { FormControl, Validators } from '@angular/forms';



@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: './dialog-nouvelle-lignedefrais.html',
    styleUrls: ['./lignedefrais.component.css']
    })
export class DialogNouvelleLignedefrais implements OnInit{

    montantControl = new FormControl('', [
        Validators.required,
        Validators.pattern('^\\d+(\.\\d{1,2})?$')
    ]);
    getErrorMessage() {
        return this.montantControl.hasError('required') ? 'Montant manquant' :
            this.montantControl.hasError('pattern') ? 'Montant invalide' : '';
    }
    missionControl = new FormControl('', [Validators.required]);
    libelleControl = new FormControl('', [Validators.required]);

    libelles: ILibelle[] = [
        {value: 'Taxi'},
        {value: 'Restaurant'},
        {value: 'Hotel'},
        {value: 'Fourniture'},
        {value: 'Essence'},
        {value: 'Autre'}
    ];

    missionsold : IMissionOld[] = [];
    missions : IMission[] = [];
    hasMiss: boolean = true;
    _ldfValide : boolean = false;
    isAvance : boolean = false;
    dateAvance : String = '';
    nbJours : number = 0;
    mobileVersion:boolean = false;

    constructor(
        public dialogRef: MatDialogRef<DialogNouvelleLignedefrais>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private lignedefraisService : LignedefraisService) {
            this.mobileVersion = this.data.mobileVersion;
        }
        
    ngOnInit() {
        
        this.lignedefraisService
        .getMissionsCollabLignedefrais({id : this.data.comp.id_collab.toString()})
        .subscribe( (data : IMission[]) => {
                this.missions = data;
                if (this.missions.length == 0 ) {
                    this.hasMiss = false;
                    this.delay(2000).then(any => {
                        this.data = null;
                        this.dialogRef.close();
                    });
                }
            });
    }

    onClick(): void {
        this.data.comp.montant =  this.montantControl.value;
        // verification de la validité de la note de frais 
        // avec les champs missions, libellé et montant
        if(this._ldfValide) {
            this.data.comp.valide = true;
            // query SQL pour l'ajout de la ligne de frais
            this.lignedefraisService.createLignedefrais({
                id_ndf : this.data.comp.id_ndf,
                id_mission : this.data.comp.id_mission,
                libelle : this.data.comp.libelle,
                montant : this.data.comp.montant,
                commentaire : this.data.comp.commentaire
            });
        }
        else {
            this.data.comp.valide = false;
        }
    }

    onChange(value : any) {
        if(this.montantControl.value)
            this._ldfValide = this.data.comp.id_mission != '' && this.data.comp.libelle != '' && this.montantValid(this.montantControl.value);
        else
            this._ldfValide = false;
    }


    montantValid(montant : String) : boolean {
        return (montant != '') && (montant.match('\\d+(\.\\d{1,2})?')[0] == montant);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>( {} ));
    }
}