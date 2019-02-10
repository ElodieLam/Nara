var db = require('../db');

var Notifndf = {
    getNotifNdfFromId: function(data, callback)
    {
        return db.query('SELECT * FROM t_notif_ndf WHERE id_cds = ?', [data.id], callback);
    },
    createNotifNdf: function (data, callback) 
    {
        date = new Date();
        // trier les id_missions
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
    createNotifNdfAvance: function (data, callback) 
    {
        date = new Date();
        // trier les id_missions
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
}
module.exports = Notifndf;

