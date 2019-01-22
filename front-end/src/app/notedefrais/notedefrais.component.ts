import { Component, OnInit } from '@angular/core';
import { NotedefraisService } from './notedefrais.service';
import { INotedefrais } from './notedefrais.interface';
import { ILignedefrais } from '../lignedefrais/lignedefrais.interface';
import { Router } from "@angular/router";
import { strictEqual } from 'assert';
import { stringify } from '@angular/core/src/render3/util';

@Component({
  selector: 'app-notedefrais',
  templateUrl: './notedefrais.component.html',
  styleUrls: ['./notedefrais.component.css']
})
export class NotedefraisComponent implements OnInit {

  lnotedefrais: INotedefrais[];
  //data: Notedefrais = { id_ndf:null, id_collab:6, mois:null, annee:null, total:null, };
  dataS: String = '6';
  topthreeNdf: string[] = ['null', 'null','null'];
  topthreeMonth: string[] = ['null', 'null','null'];
  constructor(private notedefraisService: NotedefraisService , private router: Router) { }
  lunlignedefrais: ILignedefrais[];
  ldeuxlignedefrais: ILignedefrais[];
  ltroislignedefrais: ILignedefrais[];
  private sub: any;

  ngOnInit() {
    this.sub = this.notedefraisService
      .getNotedefraisFromIdCollab(this.dataS)
        .subscribe( (data : INotedefrais[]) => {
        this.lnotedefrais = data;
        if(this.lnotedefrais.length != 0){
          this.lnotedefrais.sort((a, b) => {   
            return b.annee.valueOf() - a.annee.valueOf() || b.mois.valueOf() - a.mois.valueOf();
          });
          //TODO verifier si elles sont toutes validees etc.
          console.log("here");
          this.topthreeNdf[0] = this.lnotedefrais[0].id_ndf.toString();
          this.topthreeMonth[0] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[0].annee;
          this.topthreeNdf[1] = this.lnotedefrais[1].id_ndf.toString();
          this.topthreeMonth[1] = this.lnotedefrais[1].mois + "-" + this.lnotedefrais[1].annee;
          this.topthreeNdf[2] = this.lnotedefrais[2].id_ndf.toString();
          this.topthreeMonth[2] = this.lnotedefrais[2].mois + "-" + this.lnotedefrais[2].annee;
     /*     if(this.topthreeNdf[0] != 'null')
    {
      this.sub  = this.notedefraisService
      .getLignesdefraisFromIdNdf(this.lnotedefrais[0].id_ndf)
      .subscribe( (data : ILignedefrais[]) => {
        this.lunlignedefrais = data;
        console.log()
      });
      this.sub.unsubscribe();
    }*/

    /*
          this.notedefraisService
            .getLignesdefraisFromIdNdf(this.lnotedefrais[1].id_ndf)
              .subscribe( (data : ILignedefrais[]) => {
                this.ldeuxlignedefrais = data;
          });
          */
    if(this.topthreeNdf[2] != 'null')
    {
      
      this.notedefraisService
      .getLignesdefraisFromIdNdf(this.lnotedefrais[2].id_ndf.toString())
      .subscribe( (data : ILignedefrais[]) => {
        this.ltroislignedefrais = data;
        console.log(data);
      });
      
    }
        }
    }); 
  

    
  }
  
  moisNotedefrais(index : number) {
    console.log("mois ?");
    if(this.lnotedefrais != null)
      return this.lnotedefrais[index].mois + "-" + this.lnotedefrais[index].annee;
    else
      return "mm-aaaa";
  }

  getNommission(id : number) {
    this.notedefraisService
      .getNommissionFromId(id)
        .subscribe( (data : string) => {
          return data;
        });
  }

  goToNotedefrais (index : number) {
    this.router.navigate(['/lignedefrais', this.topthreeNdf[index]]);
  }
  
}

