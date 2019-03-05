/**Interface d'une information congé qui suit celle de la base de données */
export interface IConge
{
    id_collab: number;
    rtt_restant: number;
    rtt_pris: number;
    cp_restant: number;
    cp_pris: number;
    css_pris: number;
}