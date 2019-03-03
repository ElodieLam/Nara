import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatListSubheaderCssMatStyler } from '@angular/material';
import { LignedefraisService } from './lignedefrais.service';

import { ILignedefrais } from './lignedefrais.interface';


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-envoyer-avance.html',
  styleUrls: ['./lignedefrais.component.css']
})
export class DialogEnvoyerAvance implements OnInit{
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource;
  displayedColumns: string[] = ['mission', 'libelle', 'montant_estime', 'montant_avance'];
  dataSourceMobile;
  displayedColumnsMobile: string[] = ['avance'];
  _avanceValid:boolean = true;
  mobileVersion:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEnvoyerAvance>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lignedefraisService : LignedefraisService) {
      this.mobileVersion = data.mobile;
    }
    
  ngOnInit() {
    if(this.mobileVersion) {
      this.dataSourceMobile = new MatTableDataSource<ILignedefrais>(this.data.liste);
      this.dataSourceMobile.paginator = this.paginator;
    }
    else {
      this.dataSource = new MatTableDataSource<ILignedefrais>(this.data.liste);
      this.dataSource.paginator = this.paginator;
    }
  }

  onClick(): void {
    var liste = []
    var listeCds = [];
    this.data.liste.forEach(element => {
        if(element.id_chef == this.data.id_collab)
          liste.push({
            id : element.id_ldf, id_ndf : element.id_ndf, 
            montant_avance : element.montant_avance, avance : true, stat : 2 
          })
        else
          liste.push({
            id : element.id_ldf, id_ndf : element.id_ndf, 
            montant_avance : element.montant_avance, avance : true, stat : 3 
          })
        if(element.id_chef != this.data.id_collab) {
          var isIn = false;
          listeCds.forEach( cds =>  {
            if(cds == element.id_chef)
            isIn = true
          });
          isIn ? {} : listeCds.push(element.id_chef);
        }
    });
    this.lignedefraisService.updateLignedefraisGlobal( {
      liste : liste, listeCds : listeCds
    }); 
  }

  onChange() {
    for(var i=0; i < this.data.liste.length; i++) {
      if(!this.montantValid(this.data.liste[i].montant_avance)
        || this.data.liste[i].montant_avance > this.data.liste[i].montant_estime) {
        this._avanceValid = false;
        break;
      }
      this._avanceValid = true;
    }
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