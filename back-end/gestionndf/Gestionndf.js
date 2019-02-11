var db = require('../db');

var Gestionndf = {
    getNdfFromIdCds:function(data, callback)
    {
        return db.query(
            'SELECT noti.id_ndf, noti.id_collab, noti.date, col.prenom_collab, col.nom_collab, \
            ndf.mois, ndf.annee, noti.avance, noti.nb_lignes \
            FROM t_notif_ndf as noti, t_collaborateur as col, t_note_de_frais as ndf \
            WHERE noti.id_cds = ? AND noti.id_collab = col.id_collab AND noti.id_ndf = ndf.id_ndf', 
            [data.id], callback);
    },
    getLdfFromIdCollabIdNdf:function(data, callback)
    {
        return db.query(
            'SELECT av.id_ldf, av.id_ndf, av.id_mission, miss.nom_mission, av.libelle_ldf, \
            av.montant_ldf, av.date_ldf, av.status_ldf, av.commentaire_ldf, av.motif_refus, \
            av.justif_ldf, av.mission_passee, av.montant_estime, av.montant_avance \
            FROM t_ligne_de_frais_avance as av, t_mission as miss \
            WHERE av.id_ndf = ? AND av.id_mission = miss.id_mission AND miss.id_chef = ? \
            AND (NOT (av.status_ldf = \'avnoSent\' OR av.status_ldf = \'noSent\')) \
            UNION \
            SELECT ldf.id_ldf, ldf.id_ndf, ldf.id_mission, miss.nom_mission, ldf.libelle_ldf, \
            ldf.montant_ldf, ldf.date_ldf, ldf.status_ldf, ldf.commentaire_ldf, ldf.motif_refus, \
            ldf.justif_ldf, Null as mission_passee, Null as montant_estime, Null as montant_avance \
            FROM t_ligne_de_frais as ldf, t_mission as miss \
            WHERE ldf.id_ndf = ? AND ldf.id_mission = miss.id_mission AND miss.id_chef = ? \
            AND NOT ldf.status_ldf = \'noSent\'', 
            [data.id_ndf, data.id_cds, data.id_ndf, data.id_cds], callback);
    },
    updateGestionLignedefrais: function (data, callback) {
        var sql = 'UPDATE t_ligne_de_frais SET status_ldf = ?, motif_refus = ? WHERE id_ldf = ?';
        return db.query(sql, 
            [data.statut, data.motif, data.id], callback);
    },
    updateGestionAvance: function (data, callback) {
        var sql = 'UPDATE t_ligne_de_frais_avance SET status_ldf = ?, motif_refus = ? WHERE id_ldf = ?';
        return db.query(sql, 
            [data.statut, data.motif, data.id], callback);
    },

}

module.exports = Gestionndf;