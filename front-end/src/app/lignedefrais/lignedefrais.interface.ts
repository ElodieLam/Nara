export interface ILignedefraisFull {
    id_ldf: Number;
    id_ndf: Number;
    id_mission: Number;
    id_chef: Number;
    nom_mission: String;
    libelle_ldf: String;
    montant_ldf: Number;
    date_ldf: Date;
    statut_ldf: String;
    commentaire_ldf: String;
    motif_refus: String;
    justif_ldf: Blob;
    mission_passe: boolean;
    montant_estime: Number;
    montant_avance: Number;
}

export interface ILignedefrais {
    id_ldf: Number;
    id_ndf: Number;
    id_mission: Number;
    id_chef: Number;
    avance: boolean;
    montant_avance: Number;
    montant_estime: Number;
    status: String;
    mission: String;
    date: Date;
    libelle: String;
    montant: Number;
    commentaire: String;
    commentaire_refus: String;
    justificatif: Blob;
 }

export interface IMission { 
    id_mission : number;
    nom_mission : string 
}

export interface ILibelle {
    value: string;
}

export interface IAvance {
    id_ldf: Number;
    id_ndf:Number;
    id_mission: Number;
    id_chef: Number;
    nom_mission: String;
    libelle: String;
    montant_estime: Number;
    montant_avance: Number;
    commentaire: String;
  }

export interface ILignedefraisShort {
    id_ldf: Number;
    id_ndf: Number;
    id_mission: Number;
    id_chef: Number;
    nom_mission: String;
    libelle: String;
    avance: Boolean;
    apres_mission: Boolean;
    montant: Number;

}