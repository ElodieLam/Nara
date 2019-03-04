export interface INotedefrais {
    id_ndf: Number;
    id_collab: Number;
    total: Number;
    mois: Number;
    annee: Number;
  }

  export interface INotedefraisHistorique {
    id_ndf:Number;
    mois:Number;
    annee:Number;
    moisWord:String;
    wait:Number;
  }