// Notif service
export interface INotifService {
  ndfforcds : Boolean;
  congeforcds: Boolean;
  id_collab: Number;
  nom_collab: String;
  prenom_collab: String;
  nom_service: String;
  id_dem: Number;
  type: String;
  statut: String;
  dateD: String;
  dateF: String;
  dem: Boolean;
  id_ndf: Number;
  avance: Boolean;
  nb_lignes: Number;
  date: String;
  mois: String;
  annee: String; 
}

export interface INotifServiceDisplay {
  ndfforcds: Boolean;
  congeforcds: Boolean;
  id: Number;
  id_collab: Number;
  service: String;
  nom: String;
  prenom: String;
  date_notif: Date;
  date: String;
  statut: String;
  type: String;
  color: string;
}

//Notif simple

export interface INotifDisplay {
  ndf: Boolean;
  id: Number;
  date_notif: Date;
  date: String;
  type: String;
  statut: String;
  color: string;
}

export interface INotif {
  ndf: Boolean;
  id_collab: Number;
  id_dem: Number;
  type:String;
  statut:String;
  motif:String;
  dateD:String;
  dateF:String;
  dem:Boolean;
  id_ndf:Number;
  avance:Boolean;
  acceptee:Boolean;
  nb_lignes:Number;
  date: String;
  mois:String;
  annee: String;
}



