import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-notif-msg',
  templateUrl: './notif-msg.component.html',
  styleUrls: ['./notif-msg.component.css']
})
export class NotifMsgComponent implements OnInit {

  private sub : any;
  @Input() type;
  @Input() date;
  @Input() statut;
  @Input() color;
  @Input() dateNotif;


  componentData : any = {
    type : "",
    date : "",
    statut: "",
    color: "",
    dateNotif: "",
  }

  constructor() { 
  }
 
  ngOnInit() {

      //infos à afficher dans le tableau
      this.componentData.type = this.type;
      this.componentData.date = this.date;
      this.componentData.statut = this.statut;
      this.componentData.color = this.color;
      this.componentData.dateNotif = this.dateNotif;
      console.log(this.componentData);
      
      
  }

  ngAfterViewInit() {
    /*if (this.componentData.type == "Demande de congé") {
      console.log(this.componentData.type);
      //document.getElementById("divColor").classList.remove('make-blue');
      document.getElementById("divColor").classList.add("make-orange");
      //document.getElementById("divColor").style.backgroundColor = "orange";
      this.color = "orange";
    } 
    else if (this.componentData.type == "Note de frais") {
      console.log(this.componentData.type);
     // document.getElementById("divColor").classList.remove('make-orange');
      document.getElementById("divColor").classList.add("make-blue");
      //document.getElementById("divColor").style.backgroundColor = "cyan";
      this.color = "cyan";
    }*/
  }

  getTrColor(type){
    if (type == "Demande de congé") {
      console.log(type);
      this.color = "orange";
      return this.color;
    } 
    else if (type == "Note de frais") {
      this.color = "cyan";
      return this.color;
    }
  }

}
