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
  data: Notedefrais = { id_ndf:null, id_collab:6, mois:null, total:null, };
  
  constructor(private notedefraisService: NotedefraisService , private router: Router) { }

  ngOnInit() {
    console.log("here");
    
    this.notedefraisService
      .getNotedefraisFromIdCollab(this.data)
        .subscribe( (data : Notedefrais[]) => {
        this.lnotedefrais = data;
      });
  }
  
  goToNotedefrais () {
    this.router.navigateByUrl('/lignedefrais');
  }
  
}

