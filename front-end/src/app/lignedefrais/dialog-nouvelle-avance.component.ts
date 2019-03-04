import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LignedefraisService } from './lignedefrais.service';
import { ILibelle, IMission, IMissionOld } from './lignedefrais.interface';
import { FormControl, Validators } from '@angular/forms';



@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: './dialog-nouvelle-avance.html',
    styleUrls: ['./lignedefrais.component.css']
    })
export class DialogNouvelleAvance implements OnInit{

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
    mobileVersion:boolean =false;

    constructor(
        public dialogRef: MatDialogRef<DialogNouvelleAvance>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private lignedefraisService : LignedefraisService) {
            this.mobileVersion = this.data.mobileVersion;
        }
        
    ngOnInit() {
        
        this.lignedefraisService
        .getMissionsCollabAvance({id : this.data.comp.id_collab.toString()})
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
            this.lignedefraisService.createAvance({
                id_ndf : this.data.comp.id_ndf,
                id_mission : this.data.comp.id_mission,
                libelle : this.data.comp.libelle,
                montant : this.data.comp.montant,
                commentaire : this.data.comp.commentaire
            })
        }
        else {
            this.data.comp.valide = false;
        }
    }

    onChange(value : any) {
        if(this.idIsAvance(this.data.comp.id_mission)) {
            this.isAvance = true;
        }
        if(this.montantControl.value)
            this._ldfValide = this.data.comp.id_mission != '' && this.data.comp.libelle != '' && this.montantValid(this.montantControl.value);
        else
            this._ldfValide = false;
    }

    idIsAvance(id : number) : boolean {
        this.dateAvance = '';
        this.isAvance = false;
        var is = false;
        this.missions.forEach( miss => {
            if(id == miss.id_mission) {
                is = true;
                this.dateAvance = miss.date_mission;
                var dateone = new Date(miss.date_mission.toString()); 
                var datetwo = new Date();
                datetwo.setHours(0,0,0,0);
                var oneDay = 24*60*60*1000; // Calculates milliseconds in a day
                this.nbJours = Math.abs((dateone.getTime() - datetwo.getTime())/(oneDay));
            }
        });
        return is;
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