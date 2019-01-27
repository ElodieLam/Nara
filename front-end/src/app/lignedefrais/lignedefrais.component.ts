import { Component, OnInit, SimpleChange, SimpleChanges, OnChanges, ViewChild, Input } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { LignedefraisService } from './lignedefrais.service';
import { ActivatedRoute } from '@angular/router';
import { ILignedefraisFull, ILignedefrais } from './lignedefrais.interface';

@Component({
  selector: 'app-lignedefrais',
  templateUrl: './lignedefrais.component.html',
  styleUrls: ['./lignedefrais.component.css']
})
export class LignedefraisComponent implements OnInit, OnChanges {
 
  id_ndf: number = 0;
  
  private _id_ndf: number;
  private sub: any;
  listlignedefraisfull : ILignedefraisFull[];
  listlignedefrais : ILignedefrais[] = [];
  dataSource;
  displayedColumns: string[] = ['avance', 'montant_avance', 'status', 'mission', 'date',
  'libelle', 'montant', 'commentaire', 'justificatif', 'modifier', 'supprimer'];
  
  displayedColumnsold: string[] = ['id_ldf', 'id_ndf', 'nom_mission', 'libelle_ldf', 'montant_ldf',
  'date_ldf', 'status_ldf', 'commentaire_ldf', 'motif_refus', 'justif_ldf', 'mission_passe',
  'montant_estime', 'montant_avance'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private lignedefraisService : LignedefraisService, private route : ActivatedRoute) { }
  
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      console.log("init");
      this.id_ndf = +params['id'];
    });
    console.log(this.id_ndf);
    this.lignedefraisService
      .getLignesdefraisFromIdNdf(this.id_ndf.toString())
      .subscribe( (data : ILignedefraisFull[]) => {
        console.log(data);
        this.listlignedefraisfull = data;
        
        this.listlignedefraisfull.forEach( ldf => {
          this.listlignedefrais.push(
            { 'id_ldf' : ldf.id_ldf, 'avance' : (ldf.mission_passe == null) ? false : true,
              'montant_avance' : ldf.montant_avance, 'status' : ldf.status_ldf, 
              'mission' : ldf.nom_mission, 'date' : ldf.date_ldf, 
              'libelle' : ldf.libelle_ldf, 'montant' : ldf.montant_ldf, 
              'commentaire' : ldf.commentaire_ldf, 'justificatif' : ldf.justif_ldf})
        });
        this.dataSource = new MatTableDataSource<ILignedefrais>(this.listlignedefrais);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    const id: SimpleChange = changes.id_ndf;
    this._id_ndf = id.currentValue.toUpperCase();
  }

  temp(){

  }
  ngOnDestroy() {
    console.log("destroy ldf")
    this.sub.unsubscribe();
  }

}
