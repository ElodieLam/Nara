import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LignedefraisService } from './lignedefrais.service';
import { ILignedefrais } from './lignedefrais.interface';

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-envoyer-lignes.html',
  styleUrls: ['./lignedefrais.component.css']
})
export class DialogEnvoyerLignes implements OnInit{
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource;
  displayedColumns: string[] = ['avance', 'mission', 'libelle', 'montant'];
  size : number;
  constructor(
    public dialogRef: MatDialogRef<DialogEnvoyerLignes>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private lignedefraisService : LignedefraisService) {}
    
  ngOnInit() {
    this.size = this.data.liste.length;
    this.dataSource = new MatTableDataSource<ILignedefrais>(this.data.liste);
    this.dataSource.paginator = this.paginator;
  }

  onClick(): void {
    var liste = []
    var listeCds = [];
    this.data.liste.forEach(element => {
        if(element.avance) {
          if(element.id_chef == this.data.id_collab)
            liste.push({id : element.id_ldf, id_ndf : element.id_ndf, avance : true, stat : 8 })
          else
            liste.push({id : element.id_ldf, id_ndf : element.id_ndf ,avance : true, stat : 7 })
        }
        else {
          if(element.id_chef == this.data.id_collab)
            liste.push({id : element.id_ldf, id_ndf : element.id_ndf, avance : false, stat : 8 })
          else
            liste.push({id : element.id_ldf, id_ndf : element.id_ndf, avance : false, stat : 7 })
        }
        if(element.id_chef != this.data.id_collab) {
          var isIn = false;
          listeCds.forEach( cds =>  {
            if(cds == element.id_chef)
            isIn = true
          });
          isIn ? {} : listeCds.push(element.id_chef);
        }
    });
    console.log(listeCds)
    this.lignedefraisService.updateLignedefraisGlobal( {
      liste : liste, listeCds : listeCds
    });    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}