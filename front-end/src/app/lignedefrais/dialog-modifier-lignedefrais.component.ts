import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LignedefraisService } from './lignedefrais.service';
import { ILibelle, IMission, IMissionOld } from './lignedefrais.interface';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: './dialog-modifier-lignedefrais.html',
    styleUrls: ['./lignedefrais.component.css']
  })
  export class DialogModifierLignedefrais implements OnInit{
  
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
  
    _libModif : boolean = true;
    _ldfValide : boolean = false;
    _refusCDS :boolean = false;
    _refusCompta :boolean = false;
    _modif : boolean = false;
    mobileVersion : boolean = false;

    valuesAtStart : any = {
      libelle : '',
      montant : 0,
      commentaire : ''
    }
    
    constructor(
      public dialogRef: MatDialogRef<DialogModifierLignedefrais>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private lignedefraisService : LignedefraisService) {
        this.mobileVersion = this.data.mobileVersion;
      }
     
    ngOnInit() {
      this.montantControl.setValue(this.data.comp.montant);
      // valeurs pour la comparaison pour activer le bouton modifier
      this.valuesAtStart = { libelle : this.data.comp.libelle, montant : this.data.comp.montant,
        commentaire : this.data.comp.commentaire };
      // init pour savoir si on affichera le motif de refus dans le dialog
      if(this.data.stat == 'Refusée CDS')
        this._refusCDS = true;
      if(this.data.stat == 'Refusée Compta')
        this._refusCompta = true;
    }
    
  
    onClick(): void {
      this.data.comp.montant =  this.montantControl.value;
      // verification de la validité de la note de frais 
      // avec les champs missions, libellé et montant
      if(this._ldfValide) {
        this.data.comp.valide = true;
        // query SQL pour l'ajout de la ligne de frais
        this.lignedefraisService.updateLignedefrais({
          id_ldf : this.data.comp.id_ldf,
          libelle : this.data.comp.libelle,
          montant : this.data.comp.montant,
          commentaire : this.data.comp.commentaire,
          id_cds : this.data.id_cds,
          id_ndf : this.data.id_ndf
        });
      }
    }
  
    onChange() {
      this._modif = (this.valuesAtStart.libelle != this.data.comp.libelle) || 
        (this.valuesAtStart.montant != this.montantControl.value) ||
        (this.valuesAtStart.commentaire != this.data.comp.commentaire);
      if(this.montantControl.value)
        this._ldfValide = this.data.comp.libelle != '' && this.montantValid(this.montantControl.value);
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