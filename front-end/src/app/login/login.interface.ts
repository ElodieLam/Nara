export interface Collaborateur
{
    id_collab: number;
    id_service: number;
    nom_service: string;
    id_chefDeService: number;
    nom_collab: string;
    prenom_collab: string;
    isCDS: boolean;
}