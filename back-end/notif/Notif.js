var db = require('../db');

var Notif = {
    //Notif ndf et conges
    getNotifCollab: function(data, callback) {
        return db.query(
            'SELECT 1 as ndf, ndf.id_collab, NULL as id_dem, NULL as type, NULL as statut, \
            null as motif, null as dateD, null as dateF, null as dem, fr.id_ndf, fr.avance, \
            fr.acceptee, fr.nb_lignes, fr.date, ndf.mois, ndf.annee \
            FROM t_notif_ndf_from_compta as fr, t_note_de_frais as ndf, t_service as se, \
            t_collaborateur as col \
            WHERE fr.id_ndf = ndf.id_ndf AND ndf.id_collab = col.id_collab AND \
            col.id_serviceCollab = se.id_service AND col.id_collab = ? AND fr.nb_lignes > 0 \
            UNION \
            SELECT 0 as ndf, dem.id_collab, dem.id_demande_conge as id_dem, \
            dem.type_demande_conge as type, dem.status_conge as statut, dem.motif_refus as motif, \
            dem.date_debut as dateD, dem.date_fin as dateF, 1 as dem, null as id_ndf, \
            null as avance, null as acceptee, null as nb_lignes, dem.date_demande as date, null as mois, null as annee \
            FROM t_demande_conge as dem, t_collaborateur as col, t_service as se \
            WHERE dem.id_collab = col.id_collab AND col.id_serviceCollab = se.id_service AND \
            dem.id_collab = ? AND \
            (dem.status_conge = \'noRh\' OR dem.status_conge = \'noCds\' OR dem.status_conge = \'validee\') \
            UNION \
            SELECT 0 as ndf, dem.id_collab, dem.id_demande_conge as id_dem, \
            dem.type_demande_conge as type, dem.status_conge as statut, dem.motif_refus as motif, \
            dem.date_debut as dateD, dem.date_fin as dateF, 0 as dem, null as id_ndf, \
            null as avance, null as acceptee, null as nb_lignes, null as date, null as mois, null as annee \
            FROM t_modification_conge as dem, t_collaborateur as col, t_service as se \
            WHERE dem.id_collab = col.id_collab AND col.id_serviceCollab = se.id_service AND \
            dem.id_collab = ?',
            [data.id, data.id, data.id], callback);
    },
    getNotifService: function(data, callback) {
        return db.query(' \
        SELECT 1 as ndfforcds, null as congeforcds, ndf.id_collab, col.nom_collab, \
        col.prenom_collab, se.nom_service, NULL as id_dem, NULL as type, NULL as statut, \
        null as dateD, null as dateF, null as dem, noti.id_ndf, noti.avance, noti.nb_lignes, \
        noti.date, ndf.mois, ndf.annee \
        FROM t_notif_ndf as noti, t_note_de_frais as ndf, t_service as se, t_collaborateur as col \
        WHERE noti.id_ndf = ndf.id_ndf AND ndf.id_collab = col.id_collab AND \
        col.id_serviceCollab = se.id_service AND noti.id_cds = ? AND noti.nb_lignes > 0 \
        UNION \
        SELECT 0 as ndfforcds, null as congeforcds, ndf.id_collab, col.nom_collab, \
        col.prenom_collab, se.nom_service, NULL as id_dem, NULL as type, NULL as statut, \
        null as dateD, null as dateF, null as dem, noti.id_ndf, noti.avance, noti.nb_lignes, \
        noti.date, ndf.mois, ndf.annee \
        FROM t_notif_ndf_to_compta as noti, t_note_de_frais as ndf, t_service as se, \
        t_collaborateur as col \
        WHERE noti.id_ndf = ndf.id_ndf AND ndf.id_collab = col.id_collab AND \
        col.id_serviceCollab = se.id_service AND \
        se.id_service != (SELECT IF(?, 0, 2)) AND noti.nb_lignes > 0 AND 2 = ? AND col.id_collab != ? \
        UNION \
        SELECT null as ndfforcds, 1 as congeforcds, dem.id_collab, col.nom_collab, \
        col.prenom_collab, se.nom_service, dem.id_demande_conge as id_dem, \
        dem.type_demande_conge as type, dem.status_conge as statut, dem.date_debut as dateD, \
        dem.date_fin as dateF, 1 as dem, null as id_ndf, null as avance, null as nb_lignes, \
        dem.date_demande as date, null as mois, null as annee \
        FROM t_demande_conge as dem, t_collaborateur as col, t_service as se \
        WHERE dem.id_collab = col.id_collab AND col.id_serviceCollab = se.id_service AND \
        se.id_chefDeService = ? AND dem.status_conge = \'attCds\' \
        UNION \
        SELECT null as ndfforcds, 0 as congeforcds, dem.id_collab, col.nom_collab, col.prenom_collab, \
        se.nom_service, dem.id_demande_conge as id_dem, dem.type_demande_conge as type, \
        dem.status_conge as statut, dem.date_debut as dateD, dem.date_fin as dateF, 1 as dem, \
        null as id_ndf, null as avance, null as nb_lignes, dem.date_demande as date, null as mois, \
        null as annee \
        FROM t_demande_conge as dem, t_collaborateur as col, t_service as se \
        WHERE dem.id_collab = col.id_collab AND col.id_serviceCollab = se.id_service AND \
        dem.status_conge = \'attRh\' AND 1 = ? AND se.id_service != (SELECT IF(?, 0, 1)) AND \
        col.id_collab != ? ;',
        [data.id_cds, data.isCds, data.id_service, data.id_cds, data.id_cds, data.id_service,
        data.isCds, data.id_cds], callback);
    },
}

module.exports = Notif;