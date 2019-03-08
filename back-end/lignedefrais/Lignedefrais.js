var db = require('../db');

var Lignedefrais = {
    getLignesdefraisFromIdNdf:function(data, callback)
    {
        return db.query(
            'SELECT av.id_ldf, av.id_ndf, av.id_ndf_ldf, av.id_mission, miss.id_chef, miss.nom_mission, av.libelle_ldf, av.montant_ldf, \
            av.date_ldf, stat.libelle as statut_ldf, av.commentaire_ldf, av.motif_refus, av.justif_ldf, \
            miss.date_mission, av.montant_estime, av.montant_avance \
            FROM t_ligne_de_frais_avance as av, t_mission as miss, t_statut as stat \
            WHERE (av.id_ndf = ? OR av.id_ndf_ldf = ?) AND av.id_mission = miss.id_mission AND av.id_statut = stat.id_statut \
            UNION \
            SELECT ldf.id_ldf, ldf.id_ndf, Null as id_ndf_ldf, ldf.id_mission, miss.id_chef, miss.nom_mission, ldf.libelle_ldf, ldf.montant_ldf, \
            ldf.date_ldf, stat.libelle as statut_ldf, ldf.commentaire_ldf, ldf.motif_refus, ldf.justif_ldf, \
            miss.date_mission, Null as montant_estime, Null as montant_avance \
            FROM t_ligne_de_frais as ldf, t_mission as miss, t_statut as stat \
            WHERE ldf.id_ndf = ? AND ldf.id_mission = miss.id_mission AND ldf.id_statut = stat.id_statut', 
            [data.id, data.id, data.id], callback);
    },
    getMissionsCollabLignedefrais: function(data, callback)
    {
        date = new Date()
        return db.query('\
            SELECT miss.id_mission, miss.nom_mission, miss.date_mission, miss.ouverte, col.nom_collab, \
            col.prenom_collab, miss.id_chef \
            FROM t_mission as miss, t_missionCollab as missc, t_collaborateur as col \
            WHERE miss.id_mission = missc.id_mission AND missc.id_collab = col.id_collab \
            AND miss.date_mission < ? AND miss.ouverte = 1 AND col.id_collab = ?;',
            [date, data.id], callback);
    },
    getMissionsCollabAvance: function(data, callback)
    {
        date = new Date()
        return db.query('\
            SELECT miss.id_mission, miss.nom_mission, miss.date_mission, miss.ouverte, col.nom_collab, \
            col.prenom_collab, miss.id_chef \
            FROM t_mission as miss, t_missionCollab as missc, t_collaborateur as col \
            WHERE miss.id_mission = missc.id_mission AND missc.id_collab = col.id_collab \
            AND miss.date_mission >= ? AND miss.ouverte = 1 AND col.id_collab = ?;',
            [date, data.id, date, data.id], callback);
    },
    createLignedefrais: function (data, callback) {
        date = new Date();
        return db.query('INSERT INTO t_ligne_de_frais(id_ndf, id_mission, libelle_ldf, montant_ldf, \
            commentaire_ldf, date_ldf, id_statut, motif_refus, justif_ldf) \
            VALUES(?, ?, ?, ?, ?, ?, \
                (SELECT id_statut FROM t_statut WHERE libelle = ?), \'\', NULL) ; \
            UPDATE t_ligne_de_frais SET id_statut = 6 WHERE id_ndf = ? ; \
            UPDATE t_ligne_de_frais_avance SET id_statut = 6 WHERE id_ndf_ldf = ? AND id_statut > 5 ; \
            UPDATE t_notif_ndf SET nb_lignes = 0 WHERE id_ndf = ? AND avance = 0 ;', 
            [data.id_ndf, data.id_mission, data.libelle, data.montant, data.commentaire, 
                date, 'noSent', data.id_ndf, data.id_ndf, data.id_ndf],
             callback);
    },
    createAvance: function (data, callback) {
        date = new Date();
        return db.query('INSERT INTO t_ligne_de_frais_avance(id_ndf, id_ndf_ldf, id_mission, libelle_ldf, \
            montant_ldf, montant_estime, montant_avance, commentaire_ldf, date_ldf, id_statut, \
            motif_refus, justif_ldf) \
            VALUES(?, ?, ?, ?, 0, ?, ?, ?, ?, 1, \'\', NULL)', 
            [data.id_ndf, data.id_ndf, data.id_mission, data.libelle, data.montant, data.montant, data.commentaire, date], callback);
    },
    deleteLignedefrais: function (data, callback) {
        return db.query('DELETE from t_ligne_de_frais WHERE id_ldf = ? ;\
        UPDATE t_ligne_de_frais SET id_statut = 6 WHERE id_ndf = ? ; \
        UPDATE t_ligne_de_frais_avance SET id_statut = 6 WHERE id_ndf_ldf = ? AND id_statut > 5 ; \
        UPDATE t_notif_ndf SET nb_lignes = 0 WHERE id_ndf = ? AND avance = 0 ;', 
        [data.id_ldf, data.id_ndf, data.id_ndf, data.id_ndf], callback);
    },
    updateLignedefrais: function (data, callback) {
        var sql = 'UPDATE t_ligne_de_frais SET libelle_ldf = ?, montant_ldf = ?, id_statut = \
        (SELECT id_statut FROM t_statut WHERE libelle = ?), commentaire_ldf = ?, \
        motif_refus = ? WHERE id_ldf = ? ; \
        UPDATE t_ligne_de_frais SET id_statut = 6 WHERE id_ndf = ' + data.id_ndf + ' AND id_statut = 7 ; \
        UPDATE t_ligne_de_frais_avance SET id_statut = 6 WHERE id_ndf_ldf = ' + data.id_ndf + ' AND id_statut = 7 ; \
        UPDATE t_notif_ndf SET nb_lignes = 0 WHERE id_ndf = ' + data.id_ndf + ' AND avance = 0 ;';
        return db.query(sql, [data.libelle, data.montant, "noSent", data.commentaire, "", data.id_ldf], callback);
    },
    updateLignedefraisAvance: function (data, callback) {
        var sql = 'UPDATE t_ligne_de_frais_avance SET libelle_ldf = ?, montant_ldf = ?, id_statut =  \
        (SELECT id_statut FROM t_statut WHERE libelle = ?), commentaire_ldf = ?, \
        motif_refus = ?, montant_estime = ?, montant_avance = ? \
        WHERE id_ldf = ? ; ';
        if(data.status == 'noSent') {
            sql += 'UPDATE t_ligne_de_frais SET id_statut = 6 WHERE id_ndf = ' + data.id_ndf + ' AND id_statut = 7 ; \
                UPDATE t_ligne_de_frais_avance SET id_statut = 6 WHERE id_ndf_ldf = ' + data.id_ndf + ' AND id_statut = 7 ; \
                UPDATE t_notif_ndf SET nb_lignes = 0 WHERE id_ndf = ' + data.id_ndf + ' AND avance = 0 ;';
        }
        else {
            sql += 'UPDATE t_notif_ndf SET nb_lignes = (\
                SELECT COUNT(*) FROM t_ligne_de_frais_avance as ldf, t_mission as miss WHERE \
                ldf.id_statut = 3 AND ldf.id_mission = miss.id_mission AND miss.id_chef = ' + data.id_cds + ') \
            WHERE id_ndf = ' + data.id_ndf + ' AND avance = 1 AND id_cds = ' + data.id_cds + ';';
        }
        return db.query(sql, 
            [data.libelle, data.montant, data.status, data.commentaire, "",
            data.montant_estime, data.montant_avance, data.id_ldf], callback);
    },
    deleteAvance: function(data, callback) {
        return db.query('DELETE from t_ligne_de_frais_avance WHERE id_ldf = ? ;\
        UPDATE t_notif_ndf SET nb_lignes = (\
            SELECT COUNT(*) FROM t_ligne_de_frais_avance as ldf, t_mission as miss WHERE \
            ldf.id_statut = 3 AND ldf.id_mission = miss.id_mission AND miss.id_chef = ?) \
        WHERE id_ndf = ? AND avance = 1 AND id_cds = ?;', 
        [data.id_ldf, data.id_cds, data.id_ndf, data.id_cds], callback);
    },
    updateStatutGlobal: function(data, callback) {
        var id_ndf = data.liste[0].id_ndf;
        var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        date =  [year, month, day].join('-');
        var sql = '';
        var isCds = false;
        if(data.liste.length > 0) {
            data.liste.forEach(element => {
                if(element.avance) {
                    if(element.stat == 2 || element.stat == 8)
                        isCds = true;
                    if(element.stat > 5) {
                        sql += 'UPDATE t_ligne_de_frais_avance SET id_statut = ' + element.stat +
                        ', motif_refus = \'\' WHERE id_ldf = ' + element.id + ';\n';
                    }
                    else {
                        sql += 'UPDATE t_ligne_de_frais_avance SET id_statut = ' + element.stat +
                        ', montant_avance = ' + element.montant_avance + 
                        ' WHERE id_ldf = ' + element.id + ';\n';
                    }
                }
                else {
                    if(element.stat == 8)
                        isCds = true;
                    sql += 'UPDATE t_ligne_de_frais SET id_statut = ' + element.stat + ', motif_refus = \'\' \
                        WHERE id_ldf = ' + element.id + ';\n';
                }
            });
            if(data.listeCds.length > 0) {
                data.listeCds.forEach( element => {
                    sql += 'INSERT INTO t_notif_ndf(id_ndf, id_cds, date, nb_lignes, avance) \
                        VALUES( ' + id_ndf + ', ' + element + ', \'' + date + '\', ( \
                        SELECT COUNT(*) as nb \
                        FROM t_ligne_de_frais_avance as ldf, t_mission as miss \
                        WHERE ldf.id_ndf = ' + id_ndf + ' AND ldf.id_statut = 3  \
                        AND miss.id_mission = ldf.id_mission AND miss.id_chef = ' + element + '), 1) \
                        ON DUPLICATE KEY UPDATE \
                        nb_lignes = VALUES(nb_lignes), \
                        date = VALUES(date) ;'
                    sql += 'INSERT INTO t_notif_ndf(id_ndf, id_cds, date, nb_lignes, avance) \
                        VALUES( ' + id_ndf + ', ' + element + ', \'' + date + '\', ( \
                        (SELECT COUNT(*) as nb \
                        FROM t_ligne_de_frais as ldf, t_mission as miss \
                        WHERE ldf.id_ndf = ' + id_ndf + ' AND ldf.id_statut = 7 \
                        AND miss.id_mission = ldf.id_mission AND miss.id_chef = ' + element + ') \
                        + \
                        (SELECT COUNT(*) as nb \
                        FROM t_ligne_de_frais_avance as ldf, t_mission as miss \
                        WHERE ldf.id_ndf_ldf = ' + id_ndf + ' AND ldf.id_statut = 7 \
                        AND miss.id_mission = ldf.id_mission AND miss.id_chef = ' + element + ')), 0) \
                        ON DUPLICATE KEY UPDATE \
                        nb_lignes = VALUES(nb_lignes), \
                        date = VALUES(date) ;'
                })
            }
            if(isCds) {
                sql += 'INSERT INTO t_notif_ndf_to_compta(id_ndf, date, avance, nb_lignes) \
                        VALUES(' + id_ndf + ', \'' + date + '\', 0, ( \
                            COALESCE( (SELECT IF(table1.tot = table2.tot, table1.tot, 0) \
                            FROM (\
                                SELECT SUM(newTable.cnt) as tot FROM ( \
                                    SELECT id_statut, COUNT(*) as cnt, 0 as avance \
                                    FROM t_ligne_de_frais \
                                    WHERE id_ndf = ' + id_ndf + ' AND id_statut = 8 \
                                    GROUP BY(id_statut) \
                                    UNION \
                                    SELECT id_statut, COUNT(*) as cnt, 1 as avance \
                                    FROM t_ligne_de_frais_avance \
                                    WHERE id_ndf_ldf = ' + id_ndf + ' AND id_statut = 8 \
                                    GROUP BY(id_statut)) as newTable \
                                GROUP BY (newTable.id_statut)) \
                            as table1, (\
                                SELECT SUM(cnt) as tot FROM (\
                                    SELECT COUNT(*) as cnt, 0 as av \
                                    FROM t_ligne_de_frais \
                                    WHERE id_ndf = ' + id_ndf + ' \
                                    UNION \
                                    SELECT COUNT(*) as cnt, 1 as av \
                                    FROM t_ligne_de_frais_avance \
                                    WHERE id_ndf_ldf = ' + id_ndf + ' AND id_statut > 5) as newTable) \
                            as table2), 0))) \
                        ON DUPLICATE KEY UPDATE \
                        nb_lignes = VALUES(nb_lignes), \
                        date = VALUES(date) ; '
            }
        }
        return db.query(sql, callback);
    },
    cancelSending: function(data, callback) {
        return db.query('UPDATE t_ligne_de_frais SET id_statut = 6 WHERE id_ndf = ? ; \
            UPDATE t_ligne_de_frais_avance SET id_statut = 6 WHERE id_ndf_ldf = ? AND id_statut > 5 ; \
            UPDATE t_notif_ndf SET nb_lignes = 0 WHERE id_ndf = ? AND avance = 0 ; \
            UPDATE t_notif_ndf_to_compta SET nb_lignes = 0 WHERE id_ndf = ? AND avance = 0 ;',
            [data.id, data.id, data.id, data.id], callback);
    },

}

module.exports = Lignedefrais;