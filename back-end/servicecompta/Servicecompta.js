var db = require('../db');

var Servicecompta = {
    getNdfToCompta:function(data, callback)
    {
        return db.query(
            'SELECT noti.id_ndf, ndf.id_collab, col.prenom_collab, col.nom_collab, noti.date, \
            noti.avance, noti.nb_lignes, col.id_serviceCollab, se.nom_service, ndf.mois, ndf.annee \
            FROM t_notif_ndf_to_compta as noti, t_note_de_frais as ndf, t_collaborateur as col, \
            t_service as se \
            WHERE noti.id_ndf = ndf.id_ndf AND ndf.id_collab = col.id_collab AND \
            se.id_service = col.id_serviceCollab AND col.id_collab != ? AND \
            col.id_collab != se.id_chefDeService', 
            [data.id], callback);
    },
    getNdfToComptaIdNdf:function(data, callback) 
    {
        return db.query('\
            SELECT av.id_ldf, av.id_ndf, av.id_mission, miss.nom_mission, av.libelle_ldf, \
            av.montant_ldf, av.date_ldf, stat.libelle as statut_ldf, av.commentaire_ldf, av.motif_refus, \
            av.justif_ldf, av.mission_passee, av.montant_estime, av.montant_avance \
            FROM t_ligne_de_frais_avance as av, t_mission as miss, t_statut as stat \
            WHERE av.id_ndf = ? AND av.id_mission = miss.id_mission \
            AND NOT stat.libelle = \'avnoSent\' AND av.id_statut = stat.id_statut \
            UNION \
            SELECT ldf.id_ldf, ldf.id_ndf, ldf.id_mission, miss.nom_mission, ldf.libelle_ldf, \
            ldf.montant_ldf, ldf.date_ldf, stat.libelle as statut_ldf, ldf.commentaire_ldf, ldf.motif_refus, \
            ldf.justif_ldf, Null as mission_passee, Null as montant_estime, Null as montant_avance \
            FROM t_ligne_de_frais as ldf, t_mission as miss, t_statut as stat \
            WHERE ldf.id_ndf = ? AND ldf.id_mission = miss.id_mission AND \
            ldf.id_statut = stat.id_statut AND NOT stat.libelle = \'noSent\'',            
            [data.id_ndf, data.id_ndf], callback);
    },
}

module.exports = Servicecompta;