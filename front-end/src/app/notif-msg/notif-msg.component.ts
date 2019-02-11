import { Component, OnInit , Input} from '@angular/core';
import { IDemandeconge} from '../demandeconge/demandeconge.interface';
import { NotifMsgService } from './notif-msg.service';
import { INotedefrais } from '../notedefrais/notedefrais.interface';

@Component({
  selector: 'app-notif-msg',
  templateUrl: './notif-msg.component.html',
  styleUrls: ['./notif-msg.component.css']
})
export class NotifMsgComponent implements OnInit {

  private sub : any;
  @Input() id_demande = 0;
  @Input() id_collab = 0;

  demandeConge: IDemandeconge[];
  demandeNdf: INotedefrais[];

  status : any[] = [
    {key: 'noSent', value : 'Non envoyée'},
    {key: 'attCds', value : 'Attente CDS'},
    {key: 'attRh', value : 'Attente RH'},
    {key: 'noCds', value : 'Refusée CDS'},
    {key: 'noRh', value : 'Refusée RH'},
    {key: 'val', value : 'Validée'}
  ];

  componentData : any = {
    typeNotif : "",
    date : "",
    statut: "",
    commentaire : ""
  }

  constructor(private notifMsgService: NotifMsgService) { 
  }
 
  ngOnInit() {

    //Récupère la demande de congé correspondant à l'id
    this.sub = this.notifMsgService
    .getDemCongeFromIdNotif({id : this.id_demande, collab: this.id_collab})
    .subscribe( (data : IDemandeconge[]) => {
      this.demandeConge = data;

      //infos à afficher dans le tableau
      this.componentData.typeNotif = "Demande de congé";
      this.componentData.date = this.demandeConge[0].date_debut;
      this.componentData.date = this.componentData.date.substring(0, 10);
      this.componentData.statut = this.transformStatus(this.demandeConge[0].status_conge);
      this.componentData.commentaire = this.demandeConge[0].motif_refus;
      console.log(this.componentData);
    })

    //TODO, chercher toutes les lignes de frais correspondant à la id_ndf
    //statut = Lignes validées OU Lignes refusées

    /*this.sub = this.notifMsgService
    .getNdfFromIdNotif({id : this.id_demande})
    .subscribe( (data : INotedefrais[]) => {
      this.demandeNdf = data;
      console.log("Msg dem ndf id=" + this.id_demande + ": " + this.demandeNdf[0]);

      //infos à afficher dans le tableau
      this.componentData.typeNotif = "Demande de note de frais";
      this.componentData.date = this.demandeNdf[0].mois;
      //this.componentData.date = this.componentData.date.substring(0, 10);
      //this.componentData.statut = this.transformStatus(this.demandeConge[0].status_conge);
      //this.componentData.commentaire = this.demandeConge[0].motif_refus;
      console.log(this.componentData);
    })*/

  }

  transformStatus(status : String) : String {
    for(var i = 0; i < this.status.length ; i ++){
      if(this.status[i].key == status)
        return this.status[i].value;
    }
    return 'statut undefined'
  }

}
