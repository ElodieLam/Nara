var db = require('../db');

var Notifndf = {
    getNotifNdfFromId: function(data, callback)
    {
        return db.query('SELECT * FROM t_notif_ndf WHERE id_cds = ?', [data.id], callback);
    },
    createNotifNdf: function(data) {
        console.log('in progress')
        console.log(data)
    },
    // createNotifNdf: function (data) 
    // {
    //     console.log(data)
    //     date = new Date();
    //     db.getConnection(function(err) {
    //         if (err) throw err;
    //         var sql = 'SELECT miss.id_chef, COUNT(*) as nb \
    //         FROM t_ligne_de_frais as ldf, t_mission as miss \
    //         WHERE ldf.id_mission = miss.id_mission AND ldf.status_ldf = \'attCds\' AND ldf.id_ndf = ? \
    //         GROUP BY miss.id_chef';
    //         db.query(sql, [data.id_ndf], function (erro, result) {
    //             if (err) throw err;
    //             console.log(result)
    //             result.forEach( element => {
    //                 var sql2 = 'INSERT INTO t_notif_ndf(id_ndf, id_send, id_receive, date, avance, nb_lignes) \
    //                     VALUES(?, ?, ?, ?, 0, ?)\
    //                     ON DUPLICATE KEY UPDATE\
    //                         nb_lignes = VALUES(nb_lignes),\
    //                         date = VALUES(date)';
    //                 db.query(sql2,
    //                     [data.id_ndf, data.id_collab, element.id_chef, date, element.nb], 
    //                     function(err) {
    //                         if(err) throw err;

    //                     });
                    
    //             });
    //         });
    //     });
    // },
    /*createNotifNdf: function (data) 
    {
        console.log('start')
        console.log(data)
        date = new Date();
        db.getConnection(function(err) {
            if (err) throw err;
            var sql = 'SELECT miss.id_chef, ldf.status_ldf, COUNT(*) as nb \
                FROM t_ligne_de_frais as ldf, t_mission as miss \
                WHERE ldf.id_mission = miss.id_mission AND ldf.id_ndf = ? \
                GROUP BY ldf.status_ldf, miss.id_chef';
            db.query(sql, [data.id_ndf], function (err, result) {
                if (err) throw err;
                console.log('result query')
                console.log(result)
                var noatt = [];
                var lcds = [];
                result.forEach( element => {
                    console.log('id cds : ' + element.id_chef)
                    lcds.push({ id : element.id_chef });
                    if(element.status_ldf == 'attCds') {
                        console.log('il existe des attCds')
                        noatt.push({ id: element.id_chef });
                        var sql2 = 'INSERT INTO t_notif_ndf(id_ndf, id_send, id_receive, date, avance, nb_lignes) \
                        VALUES(?, ?, ?, ?, 0, ?)\
                        ON DUPLICATE KEY UPDATE\
                        nb_lignes = VALUES(nb_lignes),\
                        date = VALUES(date)';
                        db.query(sql2,
                            [data.id_ndf, data.id_collab, element.id_chef, date, element.nb], 
                            function(err) {
                                if(err) throw err;
                                
                            });
                    }
                });

                console.log('noatt')
                console.log(noatt)
                console.log('lcds')
                console.log(lcds)
                lcds.forEach(element => {
                    console.log('liste des chef de service')
                    console.log(element.id)
                    var att = false;
                    noatt.forEach(noa => {
                        console.log('dans noatt')
                        console.log(noa.id)
                        if(element.id == noa.id)
                            att = true;
                    });
                    console.log('query null ' + att)
                    if(!att) {
                        console.log(element.id + ' raz')
                        db.query('INSERT INTO t_notif_ndf(id_ndf, id_send, id_receive, date, avance, nb_lignes) \
                        VALUES(?, ?, ?, ?, 0, 0)\
                        ON DUPLICATE KEY UPDATE\
                        nb_lignes = VALUES(nb_lignes),\
                        date = VALUES(date)',
                        [data.id_ndf, data.id_collab, element.id, date], 
                        function(err) {
                            if(err) throw err;
                            
                        });
                    }
                });
            });
        });
    },*/
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
                    var sql2 = 'INSERT INTO t_notif_ndf(id_ndf, id_send, id_receive, date, avance, nb_lignes) \
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
    createOrUpdateAllNotifications : function(data, callback) {
        date = new Date();
        var query = 'INSERT INTO t_notif_ndf_to_compta(id_ndf, date, avance, nb_lignes) \
        VALUES(?, ?, 1, ( \
        SELECT COUNT(*) as nb \
        FROM t_ligne_de_frais_avance as ldf, t_statut as stat \
        WHERE ldf.id_statut = stat.id_statut AND id_ndf = ? \
        AND (stat.libelle = \'attF\' OR stat.libelle = \'avattF\') ) ) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date) ; \
        \
        INSERT INTO t_notif_ndf_to_compta(id_ndf, date, avance, nb_lignes) \
        VALUES(?, ?, 0, ( \
        SELECT COUNT(*) as nb \
        FROM t_ligne_de_frais as ldf, t_statut as stat \
        WHERE ldf.id_statut = stat.id_statut AND stat.libelle = \'attF\' AND id_ndf = ?) ) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date) ; \
        \
        INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
        VALUES(?, ?, 1, ( \
        SELECT COUNT(*) as nb \
        FROM t_ligne_de_frais_avance as ldf, t_statut as stat \
        WHERE ldf.id_statut = stat.id_statut AND id_ndf = ? \
        AND (stat.libelle = \'avnoCds\' OR stat.libelle = \'avnoF\' OR stat.libelle = \'noCds\' \
        OR stat.libelle = \'noF\') ), 0) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date) ; \
        \
        INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
        VALUES(?, ?, 0, ( \
        SELECT COUNT(*) as nb \
        FROM t_ligne_de_frais as ldf, t_statut as stat \
        WHERE ldf.id_statut = stat.id_statut AND \
            (stat.libelle = \'noCds\' OR stat.libelle = \'noF\') AND id_ndf = ?), 0) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date) ; \
        \
        INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
        VALUES(?, ?, 1, ( \
        SELECT COUNT(*) as nb \
        FROM t_ligne_de_frais_avance as ldf, t_statut as stat \
        WHERE ldf.id_statut = stat.id_statut AND id_ndf = ? AND stat.libelle = \'val\' ), 1) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date) ; \
        \
        INSERT INTO t_notif_ndf_from_compta(id_ndf, date, avance, nb_lignes, acceptee) \
        VALUES(?, ?, 0, ( \
        SELECT COUNT(*) as nb \
        FROM t_ligne_de_frais as ldf, t_statut as stat \
        WHERE ldf.id_statut = stat.id_statut AND stat.libelle = \'val\' AND id_ndf = ?), 1) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date) ; \
        \
        INSERT INTO t_notif_ndf(id_ndf, id_cds, date, nb_lignes, avance) \
        VALUES(?, ?, ?,( \
        SELECT COUNT(*) as nb \
        FROM t_ligne_de_frais as ldf, t_statut as stat, t_mission as miss \
        WHERE ldf.id_statut = stat.id_statut AND ldf.id_ndf = ? AND stat.libelle = \'attCds\' AND \
            miss.id_mission = ldf.id_mission AND miss.id_chef = ?), 0) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date) ; \
        \
        INSERT INTO t_notif_ndf(id_ndf, id_cds, date, nb_lignes, avance) \
        VALUES(?, ?, ?,( \
        SELECT COUNT(*) as nb \
        FROM t_ligne_de_frais_avance as ldf, t_statut as stat, t_mission as miss \
        WHERE ldf.id_statut = stat.id_statut AND ldf.id_ndf = ? AND \
            (stat.libelle = \'attCds\' OR stat.libelle = \'avattCds\') AND \
            miss.id_mission = ldf.id_mission AND miss.id_chef = ?), 1) \
        ON DUPLICATE KEY UPDATE \
        nb_lignes = VALUES(nb_lignes), \
        date = VALUES(date) ; \
        ';
        return db.query(query,
            [data.id_ndf, date, data.id_ndf, data.id_ndf, date, data.id_ndf, data.id_ndf, date, data.id_ndf,
                data.id_ndf, date, data.id_ndf, data.id_ndf, date, data.id_ndf, data.id_ndf, date, data.id_ndf,
                data.id_ndf, data.id_cds, date, data.id_ndf, data.id_cds, data.id_ndf, data.id_cds, date, data.id_ndf, data.id_cds],
                callback);
    },
}
module.exports = Notifndf;
