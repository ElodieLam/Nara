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

    updateLignedefraisAndNotifToAndFromCompta: function(data, callback)
    {
        console.log(data)
        var sql = '';
        if(data.id_cds != 0) {
            sql += 'UPDATE t_notif_ndf SET \
            nb_lignes = ( \
                SELECT COUNT(*) as nb \
                    FROM t_ligne_de_frais as ldf, t_mission as miss \
                    WHERE ldf.id_statut = 7 AND miss.id_mission = ldf.id_mission \
                    AND miss.id_chef = ' + data.id_cds + ' AND ldf.id_ndf = ' + data.id_ndf + ') \
            WHERE id_ndf = + ' + data.id_ndf + ' AND id_cds = ' + data.id_cds + ' AND \
            avance = 0 ; ';
        }
        else {
            sql += 'UPDATE t_notif_ndf_to_compta SET \
                nb_lignes = ( \
                    SELECT COUNT(*) as nb \
                    FROM t_ligne_de_frais as ldf WHERE ldf.id_statut = 8 \
                    AND ldf.id_ndf = ' + data.id_ndf + ') \
                WHERE id_ndf = + ' + data.id_ndf + ' AND avance = 0 ; '
        }
        date = new Date();
        switch (data.stat) {
            case 7: 
                console.log('att cds')
                if(data.statOld == 9)
                    return db.query(
                        'UPDATE t_ligne_de_frais SET id_statut = ?, motif_refus = \'\' WHERE id_ldf = ? ;' + sql +
                        'UPDATE t_notif_ndf_from_compta SET \
                        nb_lignes = ( \
                            SELECT COUNT(*) as nb \
                            FROM t_ligne_de_frais as ldf \
                            WHERE (ldf.id_statut = 9 OR ldf.id_statut = 10) AND ldf.id_ndf = ?) \
                        WHERE id_ndf = ? AND avance = 0 AND acceptee = 0 ; ',
                        [data.stat, data.id_ldf, data.id_ndf, data.id_ndf],
                        callback);
                if(data.statOld == 8)
                    return db.query(
                        'UPDATE t_ligne_de_frais SET id_statut = ?, motif_refus = \'\' WHERE id_ldf = ? ;' + sql +
                        'UPDATE t_notif_ndf_to_compta SET \
                        nb_lignes = ( \
                            SELECT COUNT(*) as nb \
                            FROM t_ligne_de_frais as ldf \
                            WHERE ldf.id_statut = 8 AND ldf.id_ndf = ?) \
                        WHERE id_ndf = ? AND avance = 0 ; ',
                        [data.stat, data.id_ldf, data.id_ndf, data.id_ndf],
                        callback);
            // en attente du service Compta
            case 8:
                console.log('att compta')
                return db.query(
                    'UPDATE t_ligne_de_frais SET id_statut = ? WHERE id_ldf = ? ;' + sql +
                    'INSERT INTO t_notif_ndf_to_compta(id_ndf, date, avance, nb_lignes) \
                    VALUES(?, ?, 0, ( \
                        SELECT COUNT(*) as nb \
                        FROM t_ligne_de_frais as ldf WHERE ldf.id_statut = 8 AND ldf.id_ndf = ?) ) \
                    ON DUPLICATE KEY UPDATE \
                    nb_lignes = VALUES(nb_lignes), \
                    date = VALUES(date) ;', 
                    [data.stat, data.id_ldf, data.id_ndf, date, data.id_ndf],
                    callback);

            // Refusée
            case 9:
            case 10:
                console.log('refusée')
                return db.query(
                    'UPDATE t_ligne_de_frais SET id_statut = ?, motif_refus = ? WHERE id_ldf = ? ;' + sql +
                    'INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
                    VALUES(?, ?, 0, ( \
                        SELECT COUNT(*) as nb \
                        FROM t_ligne_de_frais as ldf WHERE (ldf.id_statut = 9 OR ldf.id_statut = 10) \
                        AND ldf.id_ndf = ?), 0) \
                    ON DUPLICATE KEY UPDATE \
                    nb_lignes = VALUES(nb_lignes), \
                    date = VALUES(date) ;', 
                    [data.stat, data.motif, data.id_ldf, data.id_ndf, date, data.id_ndf],
                    callback);
            
            // validée
            case 11:
                console.log('validée')
                return db.query(
                    'UPDATE t_ligne_de_frais SET id_statut = ? WHERE id_ldf = ? ;' + sql +
                    'INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
                    VALUES(?, ?, 0, ( \
                        SELECT COUNT(*) as nb \
                        FROM t_ligne_de_frais as ldf WHERE ldf.id_statut = 11 AND ldf.id_ndf = ?), 1) \
                    ON DUPLICATE KEY UPDATE \
                    nb_lignes = VALUES(nb_lignes), \
                    date = VALUES(date) ;', 
                    [data.stat, data.id_ldf, data.id_ndf, date, data.id_ndf],
                    callback);
                
        }
    },

    updateAvanceAndNotifToAndFromCompta: function(data, callback)
    {
        console.log(data)
        var sql = ''
        if(data.id_cds != 0) {
            sql += 'UPDATE t_notif_ndf SET \
            nb_lignes = ( \
                SELECT COUNT(*) as nb \
                    FROM t_ligne_de_frais_avance as ldf, t_mission as miss \
                    WHERE (ldf.id_statut = 7 OR ldf.id_statut = 3) \
                    AND miss.id_mission = ldf.id_mission AND miss.id_chef = ' + data.id_cds + ' AND \
                    ldf.id_ndf = ' + data.id_ndf + ') \
            WHERE id_ndf = + ' + data.id_ndf + ' AND id_cds = ' + data.id_cds + ' AND \
            avance = 1 ; ';
        }
        else {
            sql += 'UPDATE t_notif_ndf_to_compta SET \
                nb_lignes = ( \
                    SELECT COUNT(*) as nb \
                    FROM t_ligne_de_frais_avance as ldf WHERE (ldf.id_statut = 8 OR ldf.id_statut = 2) \
                    AND ldf.id_ndf = ' + data.id_ndf + ') \
                WHERE id_ndf = + ' + data.id_ndf + ' AND avance = 1 ; ';
        }
        date = new Date();
        switch (data.stat) {
            case 3:
            case 7: 
                console.log('att cds')
                if(data.statOld == 4 || data.statOld == 9) {
                    return db.query(
                        'UPDATE t_ligne_de_frais_avance SET id_statut = ?, motif_refus = \'\' WHERE id_ldf = ? ;' + sql +
                        'UPDATE t_notif_ndf_from_compta SET \
                        nb_lignes = ( \
                            SELECT COUNT(*) as nb \
                            FROM t_ligne_de_frais_avance as ldf \
                            WHERE \
                            (ldf.id_statut = 9 OR ldf.id_statut = 10 OR ldf.id_statut = 4 OR ldf.id_statut = 5) \
                            AND ldf.id_ndf = ?) \
                        WHERE id_ndf = ? AND avance = 1 AND acceptee = 0 ; ',
                        [data.stat, data.id_ldf, data.id_ndf, data.id_ndf],
                        callback);
                }
                if(data.statOld == 2 || data.statOld == 8) {
                    return db.query(
                        'UPDATE t_ligne_de_frais_avance SET id_statut = ?, motif_refus = \'\' WHERE id_ldf = ? ;' + sql +
                        'UPDATE t_notif_ndf_to_compta SET \
                        nb_lignes = ( \
                            SELECT COUNT(*) as nb \
                            FROM t_ligne_de_frais_avance as ldf \
                            WHERE (ldf.id_statut = 8 OR ldf.id_statut = 2) AND ldf.id_ndf = ?) \
                        WHERE id_ndf = ? AND avance = 1 ; ',
                        [data.stat, data.id_ldf, data.id_ndf, data.id_ndf],
                        callback);
                }
            // en attente du service Compta
            case 2:
                console.log('av')
            case 8:
                console.log('att compta')
                return db.query(
                    'UPDATE t_ligne_de_frais_avance SET id_statut = ? WHERE id_ldf = ? ;' + sql +
                    'INSERT INTO t_notif_ndf_to_compta(id_ndf, date, avance, nb_lignes) \
                    VALUES(?, ?, 1, ( \
                        SELECT COUNT(*) as nb \
                        FROM t_ligne_de_frais_avance as ldf WHERE \
                        (ldf.id_statut = 8 OR ldf.id_statut = 2) AND ldf.id_ndf = ?) ) \
                    ON DUPLICATE KEY UPDATE \
                    nb_lignes = VALUES(nb_lignes), \
                    date = VALUES(date) ;', 
                    [data.stat, data.id_ldf, data.id_ndf, date, data.id_ndf],
                    callback);

            // Refusée
            case 4:
            case 5:
                console.log('av')
            case 9:
            case 10:
                console.log('refusée')
                return db.query(
                    'UPDATE t_ligne_de_frais_avance SET id_statut = ?, motif_refus = ? WHERE id_ldf = ? ;' + sql +
                    'INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
                    VALUES(?, ?, 1, ( \
                        SELECT COUNT(*) as nb \
                        FROM t_ligne_de_frais_avance as ldf WHERE \
                        (ldf.id_statut = 9 OR ldf.id_statut = 10 OR ldf.id_statut = 4 OR ldf.id_statut = 5) \
                        AND ldf.id_ndf = ?), 0) \
                    ON DUPLICATE KEY UPDATE \
                    nb_lignes = VALUES(nb_lignes), \
                    date = VALUES(date) ;', 
                    [data.stat, data.motif, data.id_ldf, data.id_ndf, date, data.id_ndf],
                    callback);
            
            // validée
            case 6: 
                return db.query('UPDATE t_ligne_de_frais_avance SET id_statut = ? WHERE id_ldf = ?' + sql,
                    [data.stat, data.id_ldf], callback);
            
            // validée
            case 11:
                console.log('validée')
                return db.query(
                    'UPDATE t_ligne_de_frais_avance SET id_statut = ? WHERE id_ldf = ? ;' + sql +
                    'INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
                    VALUES(?, ?, 1, ( \
                        SELECT COUNT(*) as nb \
                        FROM t_ligne_de_frais_avance as ldf WHERE ldf.id_statut = 11 AND ldf.id_ndf = ?), 1) \
                    ON DUPLICATE KEY UPDATE \
                    nb_lignes = VALUES(nb_lignes), \
                    date = VALUES(date) ;', 
                    [data.stat, data.id_ldf, data.id_ndf, date, data.id_ndf],
                    callback);
                
        }
    },

}

module.exports = Gestionndf;