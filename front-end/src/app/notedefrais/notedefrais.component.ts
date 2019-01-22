import { Component, OnInit } from '@angular/core';
import { NotedefraisService } from './notedefrais.service';
import { Notedefrais } from './notedefrais.interface'
import { Router } from "@angular/router";

@Component({
  selector: 'app-notedefrais',
  templateUrl: './notedefrais.component.html',
  styleUrls: ['./notedefrais.component.css']
})
export class NotedefraisComponent implements OnInit {

  lnotedefrais: Notedefrais[];
  //data: Notedefrais = { id_ndf:null, id_collab:6, mois:null, annee:null, total:null, };
  dataS: String = '6';
  topthreeNdf: string[] = ['null', 'null','null'];
  constructor(private notedefraisService: NotedefraisService , private router: Router) { }

  ngOnInit() {
    console.log("here");
    
    this.notedefraisService
      .getNotedefraisFromIdCollab(this.dataS)
        .subscribe( (data : Notedefrais[]) => {
        this.lnotedefrais = data;
        if(this.lnotedefrais.length != 0){
          this.lnotedefrais.sort((a, b) => {   
            return b.annee.valueOf() - a.annee.valueOf() || b.mois.valueOf() - a.mois.valueOf();
          });
          //console.log(this.lnotedefrais);
          this.topthreeNdf[0] = this.lnotedefrais[0].id_ndf.toString();
          this.topthreeNdf[1] = this.lnotedefrais[1].id_ndf.toString();
          this.topthreeNdf[2] = this.lnotedefrais[2].id_ndf.toString();
          //this.topthreeNdf[2] = this.lnotedefrais[2].mois + "-" + this.lnotedefrais[2].annee;
        }
      }); 
  }
  
  getNdfFromIndex(index: number)
  {
    
  }

  goToNotedefrais (index : number) {
    this.router.navigate(['/lignedefrais', this.topthreeNdf[index]]);
  }
  
}

