//Chef de service
export interface INotifDemFull {
  id_collab: Number;
  nom: String;
  prenom: String;
  service: String;
  id_demande_conge: Number;
  type_demande_conge: String;
  dateD: String;
  dateF: String;
  dem: Number;
  }

  export interface INotifNdfFull {
    id_ndf: Number;
    id_cds: Number;
    id_collab: Number;
    nom: String;
    prenom: String;
    mois: string;
    avance: Number;
  }

  export interface INotifServiceDisplay {
    nom: String;
    prenom: String;
    date: String;
    type: String;
    color: string;
  }

//Utilisateur simple

export interface INotifDemFull2 {
  id_collab: Number;
  service: String;
  id_demande_conge: Number;
  type: String;
  statut: String;
  motif: String;
  dateD: String;
  dateF: String;
  dem: Number;
  }

export interface INotifNdfFull2 {
  id_ndf: Number;
  date: String;
  avance: Number;
  acceptee: Number;
  id_collab: Number;
  mois: string;
}
  export interface INotifDisplay {
    date: String;
    type: String;
    statut: String;
    color: string;
  }


