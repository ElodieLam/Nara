export interface INotedefraisListe {
    id_ndf:Number;
    id_collab:Number;
    date:String;
    prenom_collab:String;
    nom_collab:String;
    mois:String;
    annee:String;
    avance:boolean;
    nb_lignes:Number;
}

export interface ILignedefraisListe {
    id_ldf: Number;
    id_ndf: Number;
    id_mission: Number;
    nom_mission: String;
    libelle_ldf: String;
    montant_ldf: Number;
    date_ldf: String;
    status_ldf: String;
    commentaire_ldf: String;
    motif_refus: String;
    justif_ldf: Blob;
    mission_passee: Boolean;
    montant_estime: Number;
    montant_avance: Number;
    avance: Boolean;
    montant_display: String;
    modif: Boolean;
    annuler: Boolean;

}