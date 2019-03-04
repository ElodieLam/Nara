import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LignedefraisService } from './lignedefrais.service';
import { ILibelle, IMissionOld, IMission } from './lignedefrais.interface';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: './dialog-modifier-avance.html',
    styleUrls: ['./lignedefrais.component.css']
  })
  export class DialogModifierAvance implements OnInit{
  
    myGroup = new FormGroup({
      montantControl : new FormControl('', [
        Validators.required,
        Validators.pattern('^\\d+(\.\\d{1,2})?$')
      ]),
      montantAvanceControl : new FormControl('', [
        Validators.required,
        Validators.pattern('^\\d+(\.\\d{1,2})?$')
      ]),
      montantEstimeControl : new FormControl('', [
        Validators.required,
        Validators.pattern('^\\d+(\.\\d{1,2})?$')
      ]),
      libelleControl : new FormControl('', [Validators.required])
    });
    getErrorMessage() {
      return this.myGroup.get('montantControl').hasError('required') ? 'Montant manquant' :
        this.myGroup.get('montantControl').hasError('pattern') ? 'Montant invalide' : '';
    }
    getErrorMessageAvance() {
      return this.myGroup.get('montantAvanceControl').hasError('required') ? 'Montant manquant' :
        this.myGroup.get('montantAvanceControl').hasError('pattern') ? 'Montant invalide' : '';
    }
    getErrorMessageEstime() {
      return this.myGroup.get('montantEstimeControl').hasError('required') ? 'Montant manquant' :
        this.myGroup.get('montantEstimeControl').hasError('pattern') ? 'Montant invalide' : '';
    }
    
    libelles: ILibelle[] = [
      {value: 'Taxi'}, {value: 'Restaurant'}, {value: 'Hotel'}, 
      {value: 'Fourniture'},{value: 'Essence'}, {value: 'Autre'}
    ];
  
    missions : IMissionOld[];
    _missModif : boolean = false;
    _libModif : boolean = true;
    _apresMiss : boolean = false;
    _ldfValide : boolean = false;
    _avance : boolean = false;
    _refusCDS :boolean = false;
    _refusCompta :boolean = false;
    _modif : boolean = false;
    mobileVersion:boolean =false;
  
    valuesAtStart : any = {
      id_mission : 0,
      libelle : '',
      montant : '',
      commentaire : '',
      montant_estime : '',
      montant_avance : ''
    }
    
    constructor(
      public dialogRef: MatDialogRef<DialogModifierAvance>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private lignedefraisService : LignedefraisService) {
        this.mobileVersion = this.data.mobileVersion;
      }
     
    ngOnInit() {
      // valeurs pour la comparaison pour activer le bouton modifier
      this.valuesAtStart = {id_mission : this.data.comp.id_mission,
        libelle : this.data.comp.libelle, montant : this.data.comp.montant,
        commentaire : this.data.comp.commentaire,
        montant_estime : this.data.comp.montant_estime,
        montant_avance : this.data.comp.montant_avance,
      };
      this.myGroup.get('montantAvanceControl').setValue(this.data.comp.montant_avance);
      this.myGroup.get('montantControl').setValue(this.data.comp.montant);
      this.myGroup.get('montantEstimeControl').setValue(this.data.comp.montant_estime);
      // init des valeurs si la ldf est une avance
      if(this.data.stat == 'Non envoyée' || 
          this.data.stat == 'Attente CDS' || 
          this.data.stat == 'Refusée CDS' || 
          this.data.stat == 'Refusée Compta') {
            this._apresMiss = true;
            this._libModif = false;
      } 
      // init pour savoir si on affichera le motif de refus dans le dialog
      if(this.data.stat == 'Refusée CDS' || this.data.stat == 'Avance refusée CDS' )
        this._refusCDS = true;
      if(this.data.stat == 'Refusée Compta' || this.data.stat == 'Avance refusée Compta' )
        this._refusCompta = true;
    }
  
    onClick(): void {
      this.data.comp.montant =  this.myGroup.get('montantControl').value;
      this.data.comp.montant_avance =  this.myGroup.get('montantAvanceControl').value;
      this.data.comp.montant_estime =  this.myGroup.get('montantEstimeControl').value;
      // verification de la validité de la note de frais 
      // avec les champs missions, libellé et montant
      if(this._ldfValide) {
        this.data.comp.valide = true;
        if(this._apresMiss) {
          this.lignedefraisService.updateLignedefraisAvance({
            id_ldf : this.data.comp.id_ldf,
            libelle : this.data.comp.libelle,
            montant : this.data.comp.montant,
            montant_avance : this.data.comp.montant_avance,
            montant_estime : this.data.comp.montant_estime,
            commentaire : this.data.comp.commentaire,
            status : 'noSent',
            id_cds : this.data.id_cds,
            id_ndf : this.data.id_ndf
          });
        }
        else {
          this.lignedefraisService.updateLignedefraisAvance({
            id_ldf : this.data.comp.id_ldf,
            libelle : this.data.comp.libelle,
            montant : 0,
            montant_avance : this.data.comp.montant_avance,
            montant_estime : this.data.comp.montant_estime,
            commentaire : this.data.comp.commentaire,
            status : 'avnoSent',
            id_cds : this.data.id_cds,
            id_ndf : this.data.id_ndf
          });
        }
  
      }
    }
  
    onChange() {
      this._modif = (this.valuesAtStart.libelle != this.data.comp.libelle) || 
        (this.valuesAtStart.montant != this.myGroup.get('montantControl').value) ||
        (this.valuesAtStart.montant_estime != this.myGroup.get('montantAvanceControl').value) ||
        (this.valuesAtStart.montant_avance != this.myGroup.get('montantEstimeControl').value) ||
        (this.valuesAtStart.commentaire != this.data.comp.commentaire);
      if(this.myGroup.get('montantControl').value && this._apresMiss)
        this._ldfValide  = this.montantValid(this.myGroup.get('montantControl').value);
      else if (this.myGroup.get('montantAvanceControl').value && this.myGroup.get('montantEstimeControl').value && !this._apresMiss)
        this._ldfValide = this.montantValid(this.myGroup.get('montantEstimeControl').value) &&
          this.montantValid(this.myGroup.get('montantAvanceControl').value) && 
          this.data.comp.libelle != '' && 
          this.myGroup.get('montantAvanceControl').value <= this.myGroup.get('montantEstimeControl').value;
      else
        this._ldfValide = false;
      return this._ldfValide && this._modif;
  
    }
    
    montantValid(montant : String) : boolean {
      if(String(montant).match('\\d+(\.\\d{1,2})?'))
        return (montant != '') && (String(montant).match('\\d+(\.\\d{1,2})?')[0] == montant);
      else
        return false;
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }