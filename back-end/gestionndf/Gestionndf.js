var db = require('../db');

var Gestionndf = {
    getNdfFromIdCds:function(data, callback)
    {
        return db.query(
            'SELECT noti.id_ndf, col.id_collab, noti.date, col.prenom_collab, col.nom_collab, \
            ndf.mois, ndf.annee, noti.avance, noti.nb_lignes \
            FROM t_notif_ndf as noti, t_collaborateur as col, t_note_de_frais as ndf \
            WHERE noti.id_cds = ? AND ndf.id_collab = col.id_collab AND noti.id_ndf = ndf.id_ndf', 
            [data.id], callback);
    },
    getLdfFromIdCollabIdNdf:function(data, callback)
    {
        return db.query(
            'SELECT av.id_ldf, av.id_ndf, av.id_mission, miss.nom_mission, av.libelle_ldf, \
            av.montant_ldf, av.date_ldf, stat.libelle as statut_ldf, av.commentaire_ldf, av.motif_refus, \
            av.justif_ldf, av.mission_passee, av.montant_estime, av.montant_avance \
            FROM t_ligne_de_frais_avance as av, t_mission as miss, t_statut as stat \
            WHERE av.id_ndf = ? AND av.id_mission = miss.id_mission AND miss.id_chef = ? \
            AND (NOT (stat.libelle = \'avnoSent\' OR stat.libelle = \'noSent\')) AND \
            av.id_statut = stat.id_statut \
            UNION \
            SELECT ldf.id_ldf, ldf.id_ndf, ldf.id_mission, miss.nom_mission, ldf.libelle_ldf, \
            ldf.montant_ldf, ldf.date_ldf, stat.libelle as statut_ldf, ldf.commentaire_ldf, ldf.motif_refus, \
            ldf.justif_ldf, Null as mission_passee, Null as montant_estime, Null as montant_avance \
            FROM t_ligne_de_frais as ldf, t_mission as miss, t_statut as stat \
            WHERE ldf.id_ndf = ? AND ldf.id_mission = miss.id_mission AND miss.id_chef = ? AND \
            ldf.id_statut = stat.id_statut \
            AND NOT stat.libelle = \'noSent\'', 
            [data.id_ndf, data.id_cds, data.id_ndf, data.id_cds], callback);
    },
    updateGestionLignedefrais: function (data, callback) {
        var sql = 'UPDATE t_ligne_de_frais \
            SET id_statut = (SELECT id_statut FROM t_statut WHERE libelle = ?), \
            motif_refus = ? WHERE id_ldf = ?';
        return db.query(sql, 
            [data.statut, data.motif, data.id], callback);
    },
    updateGestionAvance: function (data, callback) {
        var sql = 'UPDATE t_ligne_de_frais_avance \
        SET id_statut = (SELECT id_statut FROM t_statut WHERE libelle = ?), \
        motif_refus = ? WHERE id_ldf = ?';
        return db.query(sql, 
            [data.statut, data.motif, data.id], callback);
    },
    accepterNotedefrais : function(data, callback) {
        console.log(data)
        var date = new Date()
        var sql = '\
        UPDATE t_ligne_de_frais as ldf JOIN t_mission as miss ON ldf.id_mission = miss.id_mission \
        SET ldf.id_statut = 8 WHERE ldf.id_ndf = ? AND miss.id_chef = ? ; \
        UPDATE t_ligne_de_frais_avance as ldf JOIN t_mission as miss ON ldf.id_mission = miss.id_mission \
        SET ldf.id_statut = 8 WHERE ldf.id_ndf = ? AND miss.id_chef = ? AND ldf.id_statut > 5 ; \
        UPDATE t_notif_ndf SET nb_lignes = 0 WHERE id_ndf = ? AND id_cds = ? AND avance = 0 ; \
        INSERT INTO t_notif_ndf_to_compta(id_ndf, date, avance, nb_lignes) \
                    VALUES(?, ?, 0, ( \
                        COALESCE( (SELECT IF(table1.tot = table2.tot, table1.tot, 0) \
                        FROM (\
                            SELECT SUM(newTable.cnt) as tot FROM ( \
                                SELECT id_statut, COUNT(*) as cnt, 0 as avance \
                                FROM t_ligne_de_frais \
                                WHERE id_ndf = ? AND id_statut = 8 \
                                GROUP BY(id_statut) \
                                UNION \
                                SELECT id_statut, COUNT(*) as cnt, 1 as avance \
                                FROM t_ligne_de_frais_avance \
                                WHERE id_ndf = ? AND id_statut > 5 AND id_statut = 8 \
                                GROUP BY(id_statut)) as newTable \
                            GROUP BY (newTable.id_statut)) \
                        as table1, (\
                            SELECT SUM(cnt) as tot FROM (\
                                SELECT COUNT(*) as cnt, 0 as av \
                                FROM t_ligne_de_frais \
                                WHERE id_ndf = ? \
                                UNION \
                                SELECT COUNT(*) as cnt, 1 as av \
                                FROM t_ligne_de_frais_avance \
                                WHERE id_ndf = ? AND id_statut > 5) as newTable) \
                        as table2), 0))) \
                    ON DUPLICATE KEY UPDATE \
                    nb_lignes = VALUES(nb_lignes), \
                    date = VALUES(date) ; ';
        return db.query(sql, 
            [data.id_ndf, data.id_cds, data.id_ndf, data.id_cds, data.id_ndf, data.id_cds, 
                data.id_ndf, date, data.id_ndf, data.id_ndf, data.id_ndf, data.id_ndf], callback);
    },
    renvoyerNotedefrais : function(data, callback) {
        console.log(data)
        var date = new Date()
        var sql = '\
        UPDATE t_ligne_de_frais as ldf JOIN t_mission as miss ON ldf.id_mission = miss.id_mission \
        SET ldf.id_statut = 6 WHERE ldf.id_ndf = ? AND miss.id_chef = ? AND ldf.id_statut = 7; \
        UPDATE t_ligne_de_frais_avance as ldf JOIN t_mission as miss ON ldf.id_mission = miss.id_mission \
        SET ldf.id_statut = 6 WHERE ldf.id_ndf = ? AND miss.id_chef = ? AND ldf.id_statut = 7; \
        UPDATE t_notif_ndf SET nb_lignes = 0 WHERE id_ndf = ? AND id_cds = ? AND avance = 0 ; \
        INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
                    VALUES(?, ?, 0, ( \
                        SELECT (COALESCE((SELECT COUNT(*) \
                        FROM t_ligne_de_frais as ldf \
                        WHERE ldf.id_ndf = ? AND ldf.id_statut = 9), 0) \
                        + \
                        COALESCE((SELECT COUNT(*) \
                        FROM t_ligne_de_frais_avance as avance \
                        WHERE avance.id_statut = 9 AND avance.id_ndf = ?), 0) ) ), 0) \
                    ON DUPLICATE KEY UPDATE \
                    nb_lignes = VALUES(nb_lignes), \
                    date = VALUES(date) ; ';
        return db.query(sql, 
            [data.id_ndf, data.id_cds, data.id_ndf, data.id_cds, data.id_ndf, data.id_cds, 
                data.id_ndf, date, data.id_ndf, data.id_ndf], callback);
    },
    refuserLignedefrais : function(data, callback) {
        console.log(data)
        return db.query('UPDATE t_ligne_de_frais \
            SET id_statut = ?, motif_refus = ? \
            WHERE id_ldf = ? ', [data.statut, data.motif, data.id_ldf],callback);
    },
    refuserAvance : function(data, callback) {
        console.log(data)
        return db.query('UPDATE t_ligne_de_frais_avance \
            SET id_statut = ?, motif_refus = ? \
            WHERE id_ldf = ? ; \
            UPDATE t_notif_ndf SET nb_lignes = (\
                SELECT COUNT(*) FROM t_ligne_de_frais_avance as ldf, t_mission as miss WHERE \
                ldf.id_statut = 3 AND ldf.id_mission = miss.id_mission AND miss.id_chef = ? ) \
            WHERE id_ndf = ? AND avance = 1 AND id_cds = ? ;',
             [data.statut, data.motif, data.id_ldf, data.id_cds, data.id_ndf, data.id_cds], callback);
    },
    accepterAvance : function(data, callback) {
        var date = new Date()
        console.log(data)
        return db.query('UPDATE t_ligne_de_frais_avance \
            SET id_statut = 2 WHERE id_ldf = ? ; \
            INSERT INTO t_notif_ndf_to_compta(id_ndf, date, avance, nb_lignes) \
            VALUES(?, ?, 1, ( \
                SELECT COALESCE((SELECT COUNT(*) \
                FROM t_ligne_de_frais_avance as avance \
                WHERE avance.id_statut = 2 AND avance.id_ndf = ?), 0) ) ) \
            ON DUPLICATE KEY UPDATE \
            nb_lignes = VALUES(nb_lignes), \
            date = VALUES(date) ; \
            UPDATE t_notif_ndf SET nb_lignes = (\
                SELECT COUNT(*) FROM t_ligne_de_frais_avance as ldf, t_mission as miss WHERE \
                ldf.id_statut = 3 AND ldf.id_mission = miss.id_mission AND miss.id_chef = ? ) \
            WHERE id_ndf = ? AND avance = 1 AND id_cds = ? ;',
            [data.id_ldf, data.id_ndf, date, data.id_ndf, data.id_cds, data.id_ndf, data.id_cds], 
            callback);
    },
    accepterAllAvance : function(data, callback) {
        var date = new Date()
        console.log(data)
        return db.query('\
        UPDATE t_ligne_de_frais_avance as ldf JOIN t_mission as miss ON ldf.id_mission = miss.id_mission \
        SET ldf.id_statut = 2 WHERE ldf.id_ndf = ? AND miss.id_chef = ? AND ldf.id_statut = 3 ; \
        UPDATE t_notif_ndf SET nb_lignes = (\
            SELECT COUNT(*) FROM t_ligne_de_frais_avance as ldf, t_mission as miss WHERE \
            ldf.id_statut = 3 AND ldf.id_mission = miss.id_mission AND miss.id_chef = ? ) \
        WHERE id_ndf = ? AND avance = 1 AND id_cds = ? ; \
        INSERT INTO t_notif_ndf_to_compta(id_ndf, date, avance, nb_lignes) \
        VALUES(?, ?, 1, ( \
            SELECT COALESCE((SELECT COUNT(*) \
            FROM t_ligne_de_frais_avance as avance \
            WHERE avance.id_statut = 2 AND avance.id_ndf = ?), 0) ) ) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date) ; ',
        [data.id_ndf, data.id_cds, data.id_cds, data.id_ndf, data.id_cds,
        data.id_ndf, date, data.id_ndf], callback);
    },
    refuserAllAvance : function(data, callback) {
        var date = new Date()
        console.log(data)
        return db.query('\
        UPDATE t_ligne_de_frais_avance as ldf JOIN t_mission as miss ON ldf.id_mission = miss.id_mission \
        SET ldf.id_statut = 4 WHERE ldf.id_ndf = ? AND miss.id_chef = ? AND ldf.id_statut = 3 ; \
        UPDATE t_notif_ndf SET nb_lignes = (\
            SELECT COUNT(*) FROM t_ligne_de_frais_avance as ldf, t_mission as miss WHERE \
            ldf.id_statut = 3 AND ldf.id_mission = miss.id_mission AND miss.id_chef = ? ) \
        WHERE id_ndf = ? AND avance = 1 AND id_cds = ? ; \
        INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
        VALUES(?, ?, 1, ( \
            SELECT COALESCE((SELECT COUNT(*) \
            FROM t_ligne_de_frais_avance as avance \
            WHERE (avance.id_statut = 4 OR avance.id_statut = 5) AND avance.id_ndf = ?), 0) ), 0) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date) ; ',
        [data.id_ndf, data.id_cds, data.id_cds, data.id_ndf, data.id_cds,
        data.id_ndf, date, data.id_ndf], callback);
    },
}

module.exports = Gestionndf;