export interface ILignedefraisFull {
    id_ldf: Number;
    id_ndf: Number;
    id_mission: Number;
    nom_mission: String;
    libelle_ldf: String;
    montant_ldf: Number;
    date_ldf: Date;
    status_ldf: String;
    commentaire_ldf: String;
    motif_refus: String;
    justif_ldf: Blob;
    mission_passe: boolean;
    montant_estime: Number;
    montant_avance: Number;
}

export interface ILignedefrais {
    id_ldf: Number;
    id_mission: Number;
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