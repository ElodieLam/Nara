var db = require('../db');

var Lignedefrais = {
    getLignesdefraisFromIdNdf:function(data, callback)
    {
        return db.query(
            'SELECT av.id_ldf, av.id_ndf, av.id_mission, miss.nom_mission, av.libelle_ldf, av.montant_ldf, \
            av.date_ldf, av.status_ldf, av.commentaire_ldf, av.motif_refus, av.justif_ldf, \
            av.mission_passee, av.montant_estime, av.montant_avance \
            FROM t_ligne_de_frais_avance as av, t_mission as miss \
            WHERE av.id_ndf = ? AND av.id_mission = miss.id_mission\
            UNION \
            SELECT ldf.id_ldf, ldf.id_ndf, ldf.id_mission, miss.nom_mission, ldf.libelle_ldf, ldf.montant_ldf, \
            ldf.date_ldf, ldf.status_ldf, ldf.commentaire_ldf, ldf.motif_refus, ldf.justif_ldf, \
            Null as mission_passee, Null as montant_estime, Null as montant_avance \
            FROM t_ligne_de_frais as ldf, t_mission as miss \
            WHERE ldf.id_ndf = ? AND ldf.id_mission = miss.id_mission', 
            [data.id, data.id], callback);
    },
    getMissionsCollabFormIdCollab:function(data,callback)
    {
        return db.query('SELECT miss.id_mission, miss.nom_mission FROM t_mission as miss, t_missionCollab as missC \
            WHERE missC.id_collab = ? AND missC.id_mission = miss.id_mission AND miss.ouverte = TRUE',
            [data.id], callback);
    },
    createLignedefrais: function (data, callback) {
        date = new Date();
        return db.query('INSERT INTO t_ligne_de_frais(id_ndf, id_mission, libelle_ldf, montant_ldf, \
            commentaire_ldf, date_ldf, status_ldf, motif_refus, justif_ldf) \
            VALUES(?, ?, ?, ?, ?, ?, ?, \'\', NULL)', 
            [data.id_ndf, data.id_mission, data.libelle, data.montant, data.commentaire, date, 'noSent'], callback);
    },
    deleteLignedefrais: function (data, callback) {
        return db.query('DELETE from t_ligne_de_frais WHERE id_ldf = ?', [data.id], callback);
    },
    updateLignedefrais: function (data, callback) {
        var sql = 'UPDATE t_ligne_de_frais SET id_mission = ?, \
        libelle_ldf = ?, montant_ldf = ?, status_ldf = ?, commentaire_ldf = ?, \
        motif_refus = ? WHERE id_ldf = ?';
        return db.query(sql, [data.id_mission, data.libelle, data.montant, "noSent", data.commentaire, "", data.id_ldf], callback);
    },
    updateLignedefraisAvance: function (data, callback) {
        var sql = 'UPDATE t_ligne_de_frais_avance SET id_mission = ?, \
        libelle_ldf = ?, montant_ldf = ?, status_ldf = ?, commentaire_ldf = ?, \
        motif_refus = ?, montant_estime = ?, montant_avance = ? \
        WHERE id_ldf = ?';
        return db.query(sql, 
            [data.id_mission, data.libelle, data.montant, data.status, data.commentaire, "",
            data.montant_estime, data.montant_avance, data.id_ldf], callback);
    },
    createAvance: function(data, callback) {
        date = new Date();
        return db.query('INSERT INTO t_ligne_de_frais_avance(id_ndf, id_mission, libelle_ldf, montant_ldf, \
            montant_estime, montant_avance, commentaire_ldf, date_ldf, status_ldf, motif_refus, \
            justif_ldf, mission_passee) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, \'\', NULL, TRUE)', 
            [data.id_ndf, data.id_mission, data.libelle, 0, data.montant_estime, 
            data.montant_avance, data.commentaire, date, 'avattCds'], callback);
    },
    deleteAvance: function(data, callback) {
        return db.query('DELETE from t_ligne_de_frais_avance WHERE id_ldf = ?', [data.id], callback);
    },
}

module.exports = Lignedefrais;