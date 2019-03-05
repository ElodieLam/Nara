/** Format d'une demande de congé telle qu'elle est décrite dans la base de données */
export interface IDemandeconge
{
    id_demande_conge: number;
    id_collab: number;
    type_demande_conge: string;
    date_debut: Date;
    debut_matin: boolean;
    date_fin: Date;
    fin_aprem: boolean;
    status_conge: string;
    motif_refus: string;
    duree: number;
}