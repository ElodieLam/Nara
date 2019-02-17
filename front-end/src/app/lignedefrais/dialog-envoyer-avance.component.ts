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
  _avanceValid:boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogEnvoyerAvance>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lignedefraisService : LignedefraisService) {}
    
  ngOnInit() {
    this.dataSource = new MatTableDataSource<ILignedefrais>(this.data.liste);
    this.dataSource.paginator = this.paginator;
  }

  onClick(): void {
    // var liste = [];
    // var listeCds = [];
    // this.data.liste.forEach(element => {
    //   liste.push( {
    //     id : element.id_ldf,
    //     id_ndf : element.id_ndf,
    //     id_mission : element.id_mission,
    //     libelle : element.libelle,
    //     montant_estime : element.montant_estime,
    //     montant_avance : element.montant_avance,
    //     commentaire : element.commentaire
    //   });
    //   var isIn = false;
    //   listeCds.forEach( cds =>  {
    //     if(cds == element.id_chef)
    //       isIn = true
    //   });
    //   isIn ? {} : listeCds.push(element.id_chef);
    // });
    // this.lignedefraisService.deleteAndCreateAvance( {
    //   liste : liste, listeCds : listeCds
    // });

    var liste = []
    var listeCds = [];
    this.data.liste.forEach(element => {
        //liste.push({id : element.id_ldf, id_ndf : element.id_ndf ,avance : true, stat : 3 })
        console.log(element.id_chef)
        console.log(this.data.id_collab)
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
    console.log(liste)
    console.log(listeCds)
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