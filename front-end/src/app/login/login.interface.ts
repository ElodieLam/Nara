/**
 * Responsable: E.LAM
 * Interface d'un collaborateur
 */

export interface Collaborateur
{
    id_collab: number;
    id_service: number;
    nom_service: string;
    id_chefDeService: number;
    nom_collab: string;
    prenom_collab: string;
    isCDS: boolean;
    isCompta: boolean;
    isRH: boolean;
}