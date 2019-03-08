var db = require('../db');

var Servicecompta = {
    getNdfToCompta:function(data, callback)
    {
        var isCds = (data.isCds == 'true') ? true : false;
        return db.query(
            'SELECT * FROM \
            (SELECT DISTINCT col.id_collab, col.prenom_collab, col.nom_collab, ser.nom_service, \
            ndf.id_ndf, ndf.mois, ndf.annee \
            FROM t_collaborateur as col \
            JOIN t_service as ser ON col.id_serviceCollab = ser.id_service \
            JOIN t_note_de_frais as ndf ON col.id_collab = ndf.id_collab \
            WHERE col.id_collab != ? AND ser.id_service != (SELECT IF(?, 0, 2)) \
            ) as table1 \
            LEFT JOIN \
            (SELECT COUNT(ldf.id_ldf) as cnt, ldf.id_ndf as id_ndf2 \
            FROM t_ligne_de_frais as ldf \
            WHERE ldf.id_statut = 8 \
            GROUP BY(ldf.id_ndf) \
            UNION \
            SELECT COUNT(av.id_ndf) as cnt, av.id_ndf as id_ndf2 \
            FROM t_ligne_de_frais_avance as av \
            WHERE av.id_statut = 2 \
            GROUP BY(av.id_ndf) \
            UNION \
            SELECT COUNT(av.id_ndf_ldf) as cnt, av.id_ndf_ldf as id_ndf2 \
            FROM t_ligne_de_frais_avance as av \
            WHERE av.id_statut = 8 \
            GROUP BY(av.id_ndf_ldf)) as table2 ON table1.id_ndf = table2.id_ndf2 ;', 
            [data.id, isCds], callback);
    },
    getNdfToComptaIdNdf:function(data, callback) 
    {
        return db.query('\
            SELECT av.id_ldf, av.id_ndf, av.id_ndf_ldf, av.id_mission, miss.nom_mission, av.libelle_ldf, \
            av.montant_ldf, av.date_ldf, miss.date_mission, stat.libelle as statut_ldf, av.commentaire_ldf, av.motif_refus, \
            av.justif_ldf, av.montant_estime, av.montant_avance \
            FROM t_ligne_de_frais_avance as av, t_mission as miss, t_statut as stat \
            WHERE (av.id_ndf = ? OR av.id_ndf_ldf = ?) AND av.id_mission = miss.id_mission AND \
            av.id_statut = stat.id_statut \
            UNION \
            SELECT ldf.id_ldf, ldf.id_ndf, Null as id_ndf_ldf, ldf.id_mission, miss.nom_mission, ldf.libelle_ldf, \
            ldf.montant_ldf, ldf.date_ldf, miss.date_mission, stat.libelle as statut_ldf, ldf.commentaire_ldf, ldf.motif_refus, \
            ldf.justif_ldf, Null as montant_estime, Null as montant_avance \
            FROM t_ligne_de_frais as ldf, t_mission as miss, t_statut as stat \
            WHERE ldf.id_ndf = ? AND ldf.id_mission = miss.id_mission AND \
            ldf.id_statut = stat.id_statut',            
            [data.id_ndf, data.id_ndf, data.id_ndf], callback);
    },
    accepterLignes:function(data, callback) {
        var date = new Date()
        return db.query('UPDATE t_ligne_de_frais SET id_statut = 11 WHERE id_ndf = ? ; \
            UPDATE t_ligne_de_frais_avance SET id_statut = 11 WHERE id_ndf_ldf = ? AND id_statut = 8 ; \
            UPDATE t_notif_ndf_to_compta SET nb_lignes = 0 WHERE id_ndf = ? AND avance = 0 ; \
            INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
            VALUES(?, ?, 0, 1, 1) \
            ON DUPLICATE KEY UPDATE \
            nb_lignes = VALUES(nb_lignes), \
            date = VALUES(date) ; ',
            [data.id_ndf, data.id_ndf, data.id_ndf, data.id_ndf, date], callback);
    },
    refuserLignes:function(data, callback) {
        var date = new Date()
        return db.query('UPDATE t_ligne_de_frais SET id_statut = 10, motif_refus = ? WHERE id_ndf = ? ; \
            UPDATE t_ligne_de_frais_avance SET id_statut = 10, motif_refus = ? WHERE id_ndf_ldf = ? AND id_statut = 8 ; \
            UPDATE t_notif_ndf_to_compta SET nb_lignes = 0 WHERE id_ndf = ? AND avance = 0 ; \
            INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
            VALUES(?, ?, 0, 1, 0) \
            ON DUPLICATE KEY UPDATE \
            nb_lignes = VALUES(nb_lignes), \
            date = VALUES(date) ; ',
            [data.motif, data.id_ndf, data.motif, data.id_ndf, data.id_ndf, data.id_ndf, date], callback);
    },
    accepterAvance:function(data, callback) {
        var date = new Date()
        if(data.newNdf) {
            return db.query('\
            UPDATE t_ligne_de_frais_avance SET id_statut = 6 WHERE id_ldf = ? ; \
            INSERT INTO t_note_de_frais(id_collab, mois, annee, total) \
                VALUES((SELECT id_collab FROM t_collaborateur WHERE nom_collab = ?), ?, ?, 0) \
            ON DUPLICATE KEY UPDATE \
                total = VALUES(total); \
            UPDATE t_ligne_de_frais_avance SET id_ndf_ldf = (\
                SELECT id_ndf FROM t_note_de_frais WHERE mois = ? AND annee = ? AND \
                id_collab = (SELECT id_collab FROM t_collaborateur WHERE nom_collab = ?) ) \
                WHERE id_ldf = ? ; \
            UPDATE t_notif_ndf_to_compta SET nb_lignes = ( \
                SELECT COALESCE((SELECT COUNT(*) \
                FROM t_ligne_de_frais_avance as avance \
                WHERE avance.id_statut = 2 AND avance.id_ndf = ?), 0) ) \
                WHERE id_ndf = ? AND avance = 1 ; \
            INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
                VALUES( ( SELECT id_ndf FROM t_note_de_frais WHERE \
                    id_collab = (SELECT id_collab FROM t_collaborateur WHERE nom_collab = ?) AND \
                    mois = ? AND annee = ?), ?, 1, 1, 1) \
            ON DUPLICATE KEY UPDATE \
            nb_lignes = VALUES(nb_lignes), \
            date = VALUES(date) ; ',
            [data.id_ldf, data.nom_collab, data.newMonth, data.newYear, 
            data.newMonth, data.newYear, data.nom_collab, data.id_ldf, 
            data.id_ndf, data.id_ndf, data.nom_collab, data.newMonth, 
            data.newYear, date], callback);
        }
        else {
            return db.query('\
            UPDATE t_ligne_de_frais_avance SET id_statut = 6 WHERE id_ldf = ? ; \
            UPDATE t_notif_ndf_to_compta SET nb_lignes = (\
                COALESCE( (SELECT COUNT(*) FROM t_ligne_de_frais_avance WHERE id_ndf = ? \
                AND id_statut =  2), 0) ) WHERE id_ndf = ? AND avance = 1 ; \
            INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
            VALUES(?, ?, 1, 1, 1) \
            ON DUPLICATE KEY UPDATE \
            nb_lignes = VALUES(nb_lignes), \
            date = VALUES(date) ; ',
            [data.id_ldf, data.id_ndf, data.id_ndf, data.id_ndf, date], callback);
        }
    },
    refuserAvance:function(data, callback) {
        var date = new Date()
        return db.query('\
            UPDATE t_ligne_de_frais_avance SET id_statut = 5, motif_refus = ? WHERE id_ldf = ? ; \
            UPDATE t_notif_ndf_to_compta SET nb_lignes = (\
                COALESCE( (SELECT COUNT(*) FROM t_ligne_de_frais_avance WHERE id_ndf = ? \
                AND id_statut = 2), 0) ) WHERE id_ndf = ? AND avance = 1 ; \
            INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
            VALUES(?, ?, 1, 1, 0) \
            ON DUPLICATE KEY UPDATE \
            nb_lignes = VALUES(nb_lignes), \
            date = VALUES(date) ; ',
            [data.motif, data.id_ldf, data.id_ndf, data.id_ndf, data.id_ndf, date], callback);
    },
}

module.exports = Servicecompta;