import { Component, OnInit } from '@angular/core';
import { NotedefraisService } from './notedefrais.service';
import { INotedefrais } from './notedefrais.interface';
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { isoStringToDate } from '@angular/common/src/i18n/format_date';

@Component({
  selector: 'app-notedefrais',
  templateUrl: './notedefrais.component.html',
  styleUrls: ['./notedefrais.component.css'],
  providers: [DatePipe]
})
export class NotedefraisComponent implements OnInit {

  private sub : any;
  lnotedefrais: INotedefrais[];
  //data: Notedefrais = { id_ndf:null, id_collab:6, mois:null, annee:null, total:null, };
  dataS: String = '6';
  date = new Date();
  dateS: string;
  topthreeNdf: string[] = ['null', 'null','null'];
  topthreeMonth: string[] = ['null', 'null','null'];
  currentMissing : boolean = true;
  count : number = 0;
  constructor(private notedefraisService: NotedefraisService , private router: Router,
    private datePipe: DatePipe) { }
  
  ngOnInit() {
    this.sub = this.notedefraisService
      .getNotedefraisFromIdCollab({id : this.dataS})
        .subscribe( (data : INotedefrais[]) => {
          // récupération des données de la query
          this.lnotedefrais = data;
          // trie la liste de la plus récente à la plus ancienne
          if(this.lnotedefrais.length != 0){
            this.lnotedefrais.sort((a, b) => {   
              return b.annee.valueOf() - a.annee.valueOf() || b.mois.valueOf() - a.mois.valueOf();
            });
            // enlève les ndf validées
            // TODO


            // vérifie s'il existe une ndf pour le mois courrant
            this.dataS = this.datePipe.transform(this.date, 'yyyy-MM-dd');
            var str = this.dataS.split("-",2);
            
            if(+str[0] == this.lnotedefrais[0].annee 
              && +str[1] == this.lnotedefrais[0].mois){
                this.currentMissing = false;
              }

            if(this.lnotedefrais.length == 1 && this.currentMissing)
            {
              this.topthreeNdf[0] = "miss";
              this.topthreeMonth[0] = "miss";
              this.topthreeNdf[1] = this.lnotedefrais[0].id_ndf.toString();
              this.topthreeMonth[1] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[1].annee;
              this.count = 2;
            }
            else if(this.lnotedefrais.length == 1)
            {
              this.topthreeNdf[0] = this.lnotedefrais[0].id_ndf.toString();
              this.topthreeMonth[0] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[0].annee;
              this.count = 1;
            }
            else if(this.lnotedefrais.length == 2 && this.currentMissing)
            {
              this.topthreeNdf[0] = "miss";
              this.topthreeMonth[0] = "miss";
              this.topthreeNdf[1] = this.lnotedefrais[0].id_ndf.toString();
              this.topthreeMonth[1] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[0].annee;
              this.topthreeNdf[2] = this.lnotedefrais[1].id_ndf.toString();
              this.topthreeMonth[2] = this.lnotedefrais[1].mois + "-" + this.lnotedefrais[1].annee;
              this.count = 3;
            }
            else if(this.lnotedefrais.length == 2)
            {
              this.topthreeNdf[0] = this.lnotedefrais[0].id_ndf.toString();
              this.topthreeMonth[0] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[0].annee;
              this.topthreeNdf[1] = this.lnotedefrais[1].id_ndf.toString();
              this.topthreeMonth[1] = this.lnotedefrais[1].mois + "-" + this.lnotedefrais[1].annee;
              this.count = 2;
            }
            else          
            {
              this.topthreeNdf[0] = this.lnotedefrais[0].id_ndf.toString();
              this.topthreeMonth[0] = this.lnotedefrais[0].mois + "-" + this.lnotedefrais[0].annee;
              this.topthreeNdf[1] = this.lnotedefrais[1].id_ndf.toString();
              this.topthreeMonth[1] = this.lnotedefrais[1].mois + "-" + this.lnotedefrais[1].annee;
              this.topthreeNdf[2] = this.lnotedefrais[2].id_ndf.toString();
              this.topthreeMonth[2] = this.lnotedefrais[2].mois + "-" + this.lnotedefrais[2].annee;
              this.count = 3;
            }
        }
    }); 
  }
  
  goToNotedefrais () {
    this.router.navigate(['/lignedefrais', 0]);
  }
  
  ngOnDestroy() {
    console.log("destroy ndf ")
    this.sub.unsubscribe();
  }
}

