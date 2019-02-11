var db = require('../db');

var Notifndf = {
    getNotifNdfFromId: function(data, callback)
    {
        return db.query('SELECT * FROM t_notif_ndf WHERE id_cds = ?', [data.id], callback);
    },
    createNotifNdf: function (data) 
    {
        date = new Date();
        db.getConnection(function(err) {
            if (err) throw err;
            var sql = 'SELECT miss.id_chef, COUNT(*) as nb \
            FROM t_ligne_de_frais as ldf, t_mission as miss \
            WHERE ldf.id_mission = miss.id_mission AND ldf.status_ldf = \'attCds\' AND ldf.id_ndf = ? \
            GROUP BY miss.id_chef';
            db.query(sql, [data.id_ndf], function (erro, result) {
                if (err) throw err;
                result.forEach( element => {
                    var sql2 = 'INSERT INTO t_notif_ndf(id_ndf, id_collab, id_cds, date, avance, nb_lignes) \
                        VALUES(?, ?, ?, ?, 0, ?)\
                        ON DUPLICATE KEY UPDATE\
                            nb_lignes = VALUES(nb_lignes),\
                            date = VALUES(date)';
                    db.query(sql2,
                        [data.id_ndf, data.id_collab, element.id_chef, date, element.nb], 
                        function(err) {
                            if(err) throw err;
                        });
                    
                });
            });
        });
    },
    createNotifNdfAvance: function (data) 
    {
        date = new Date();
        db.getConnection(function(err) {
            if (err) throw err;
            var sql = 'SELECT miss.id_chef, COUNT(*) as nb \
            FROM t_ligne_de_frais_avance as ldf, t_mission as miss \
            WHERE ldf.id_mission = miss.id_mission AND \
            (ldf.status_ldf = \'attCds\' OR ldf.status_ldf = \'avattCds\') AND ldf.id_ndf = ? \
            GROUP BY miss.id_chef';
            db.query(sql, [data.id_ndf], function (erro, result) {
                if (err) throw err;
                result.forEach( element => {
                    var sql2 = 'INSERT INTO t_notif_ndf(id_ndf, id_collab, id_cds, date, avance, nb_lignes) \
                        VALUES(?, ?, ?, ?, 1, ?)\
                        ON DUPLICATE KEY UPDATE\
                            nb_lignes = VALUES(nb_lignes),\
                            date = VALUES(date)';
                    db.query(sql2,
                        [data.id_ndf, data.id_collab, element.id_chef, date, element.nb], 
                        function(err) {
                            if(err) throw err;
                        });
                    
                });
            });
        });
    },
    createNotifNdfToCompta: function (data, callback) {
        date = new Date();
        var sql = 'INSERT INTO t_notif_ndf_to_compta(id_ndf, date, avance, nb_lignes) \
        VALUES(?, ?, 0, (\
            SELECT COUNT(*) as nb \
            FROM t_ligne_de_frais \
            WHERE status_ldf = \'attF\' AND id_ndf = ?) ) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date)';
        return db.query(sql, 
            [data.id_ndf, date, data.id_ndf], callback);
    },
    createNotifNdfToComptaAvance: function (data, callback) {
        date = new Date();
        var sql = 'INSERT INTO t_notif_ndf_to_compta(id_ndf, date, avance, nb_lignes) \
        VALUES(?, ?, 1, (\
            SELECT COUNT(*) as nb \
            FROM t_ligne_de_frais_avance  \
            WHERE (status_ldf = \'attF\' OR status_ldf = \'avattF\') AND id_ndf = ?) ) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date)';
        return db.query(sql, 
            [data.id_ndf, date, data.id_ndf], callback);
    },
    createNotifNdfFromComptaAcc: function (data, callback) {
        date = new Date();
        var sql = 'INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
        VALUES(?, ?, 0, (\
            SELECT COUNT(*) as nb \
            FROM t_ligne_de_frais \
            WHERE status_ldf = \'val\'  AND id_ndf = ? ), 1) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date)';
        return db.query(sql, 
            [data.id_ndf, date, data.id_ndf], callback);
    },
    createNotifNdfFromComptaRef: function (data, callback) {
        date = new Date();
        var sql = 'INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
        VALUES(?, ?, 0, (\
            SELECT COUNT(*) as nb \
            FROM t_ligne_de_frais \
            WHERE (status_ldf = \'noCds\' OR status_ldf = \'noF\') AND id_ndf = ?), 0 ) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date)';
        return db.query(sql, 
            [data.id_ndf, date, data.id_ndf], callback);
    },
    createNotifNdfFromComptaAvanceAcc: function (data, callback) {
        date = new Date();
        var sql = 'INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
        VALUES(?, ?, 1, (\
            SELECT COUNT(*) as nb \
            FROM t_ligne_de_frais_avance \
            WHERE status_ldf = \'val\'  AND id_ndf = ? ), 1) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date)';
        return db.query(sql, 
            [data.id_ndf, date, data.id_ndf], callback);
    },
    createNotifNdfFromComptaAvanceRef: function (data, callback) {
        date = new Date();
        var sql = 'INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
        VALUES(?, ?, 1, (\
            SELECT COUNT(*) as nb \
            FROM t_ligne_de_frais_avance \
            WHERE (status_ldf = \'noCds\' OR status_ldf = \'noF\' OR status_ldf = \'avnoCds\' OR \
            status_ldf = \'avnoF\') AND id_ndf = ?), 0 ) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date)';
        return db.query(sql, 
            [data.id_ndf, date, data.id_ndf], callback);
    },
}
module.exports = Notifndf;
