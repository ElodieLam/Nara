import { Component, OnInit, SimpleChange, SimpleChanges, OnChanges, ViewChild, Input } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { LignedefraisService } from './lignedefrais.service';
import { ActivatedRoute } from '@angular/router';
import { ILignedefrais } from './lignedefrais.interface';

@Component({
  selector: 'app-lignedefrais',
  templateUrl: './lignedefrais.component.html',
  styleUrls: ['./lignedefrais.component.css']
})
export class LignedefraisComponent implements OnInit, OnChanges {
 
  id_ndf: number = 0;
  
  private _id_ndf: number;
  private sub: any;
  listlignedefrais : ILignedefrais[];
  dataSource;
  displayedColumns: string[] = ['id_ldf', 'id_ndf', 'id_mission', 'libelle_ldf', 'montant_ldf',
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
      .subscribe( (data : ILignedefrais[]) => {
        console.log("changes");
        console.log(data);
        this.listlignedefrais = data;
        
        this.dataSource = new MatTableDataSource<ILignedefrais>(this.listlignedefrais);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    const id: SimpleChange = changes.id_ndf;
    this._id_ndf = id.currentValue.toUpperCase();
  }

  ngOnDestroy() {
    console.log("destroy ldf")
    this.sub.unsubscribe();
  }

}
