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
    this.data.liste.forEach(element => {
        console.log(element);
        if(element.avance && !element.apres_mission) {
            this.lignedefraisService.updateStatutAvance({
                id : element.id_ldf, statut : 'avattCds'
            });
        }
        else if(element.avance){
            this.lignedefraisService.updateStatutAvance({
                id : element.id_ldf, statut : 'attCds'
            });
        }
        else {
            this.lignedefraisService.updateStatutLignedefrais({
                id : element.id_ldf, statut : 'attCds'
            });
        }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}