import { Component, OnInit, Input, SimpleChange, SimpleChanges, OnChanges } from '@angular/core';
import { NotedefraisService } from '../notedefrais/notedefrais.service';
import { INotedefraisresume } from './notedefraisresume.interface';


@Component({
  selector: 'app-notedefraisresume',
  templateUrl: './notedefraisresume.component.html',
  styleUrls: ['./notedefraisresume.component.css']
})
export class NotedefraisresumeComponent implements OnInit, OnChanges {
  @Input() id_notedefrais = 0;
  @Input() moisAnnee = "mm-aaaa";

  private _id_ndf: number;

  listLignedefrais: INotedefraisresume[];


  constructor(private notedefraisService : NotedefraisService) {
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
    });
}

ngOnInit() {
   
  }

}
