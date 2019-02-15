var db = require('../db');

var Notifndf = {
    getNotifNdfFromId: function(data, callback)
    {
        return db.query('SELECT * FROM t_notif_ndf WHERE id_cds = ?', [data.id], callback);
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
