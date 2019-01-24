export interface ILignedefrais {
    id_ldf: Number;
    id_ndf: Number;
    id_mission: Number;
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
