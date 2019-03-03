export interface INotedefraisListe {
    id_ndf:Number;
    id_send:Number;
    date:String;
    prenom_collab:String;
    nom_collab:String;
    mois:String;
    annee:String;
    avance:boolean;
    nb_lignes:Number;
}
export interface INotedefrais {
    id_collab:Number;
    prenom_collab:String;
    nom_collab:String;
    nom_service:String;
    id_ndf:Number;
    mois:Number;
    annee:Number;
    cnt:Number;
    id_ndf2:Number;
}

export interface FilterGroup {
    name: string;
    values: String[];
  }


export interface ILignedefraisListe {
    id_ldf: Number;
    id_ndf: Number;
    id_ndf_ldf:Number;
    id_mission: Number;
    nom_mission: String;
    libelle_ldf: String;
    montant_ldf: Number;
    date_ldf: String;
    statut_ldf: String;
    commentaire_ldf: String;
    motif_refus: String;
    justif_ldf: Blob;
    montant_estime: Number;
    montant_avance: Number;
    avance: Boolean;
    refutable: Boolean;
    avrefutable: Boolean;
    avacceptable: Boolean;

}