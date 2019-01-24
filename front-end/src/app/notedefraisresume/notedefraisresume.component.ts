import { Component, OnInit, Input, SimpleChange, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { NotedefraisService } from '../notedefrais/notedefrais.service';
import { INotedefraisresume } from './notedefraisresume.interface';
import { Router } from '@angular/router';


@Component({
  selector: 'app-notedefraisresume',
  templateUrl: './notedefraisresume.component.html',
  styleUrls: ['./notedefraisresume.component.css']
})
export class NotedefraisresumeComponent implements OnInit, OnChanges {
  // input du component
  @Input() id_notedefrais = 0;
  @Input() moisAnnee = "mm-aaaa";

  // pour la liste des données
  private _id_ndf: number;
  listLignedefrais: INotedefraisresume[];
  mois : string[] = ['null', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  dateVerbose : string;
  // pour la pagination
  displayedColumns: string[] = ['nom_mission', 'libelle', 'status_ligne'];
  //dataSource = new MatTableDataSource<INotedefraisresume>(this.listLignedefrais);
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private notedefraisService : NotedefraisService, private router : Router) {
  }

  ngOnInit() {
  }
  
  ngOnChanges(changes: SimpleChanges) {
    const id: SimpleChange = changes.id_notedefrais;
    //console.log('prev value: ', id.previousValue);
    //console.log('got id: ', id.currentValue);
    this._id_ndf = id.currentValue.toUpperCase();
    this.notedefraisService
      .getNotedefraisresumeFromIdNdf(this.id_notedefrais)
      .subscribe( (data : INotedefraisresume[]) => {
        console.log(data);
        this.listLignedefrais = data;
        var temp = this.moisAnnee.split("-",2);

        this.dateVerbose = this.mois[temp[0]] + " " + temp[1];
        this.dataSource = new MatTableDataSource<INotedefraisresume>(this.listLignedefrais);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  goToNotedefrais () {
    this.router.navigate(['/lignedefrais', this.id_notedefrais]);
  }




}
