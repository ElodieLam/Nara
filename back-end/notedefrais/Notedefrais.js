var db = require('../db');

var Notedefrais = {
    getNotesdefraisFromIdCollab: function(data, callback)
    {
        return db.query('SELECT * FROM t_note_de_frais WHERE id_collab = ?', [data.id], callback);
    },
    getLignesdefraisresumeFromIdNdf:function(data, callback)
    {
        return db.query('SELECT ldf.id_ldf, ldf.id_ndf, Null as id_ndf_ldf, miss.nom_mission, ldf.libelle_ldf, stat.libelle as statut_ldf, \
            FALSE as avance \
            from t_ligne_de_frais as ldf, t_mission as miss, t_statut as stat \
            WHERE ldf.id_ndf = ? and ldf.id_mission = miss.id_mission AND ldf.id_statut = stat.id_statut\
            UNION \
            SELECT ldf.id_ldf, ldf.id_ndf, ldf.id_ndf_ldf, miss.nom_mission, ldf.libelle_ldf, stat.libelle as statut_ldf, TRUE as avance \
            from t_ligne_de_frais_avance as ldf, t_mission as miss, t_statut as stat \
            WHERE (ldf.id_ndf = ? OR ldf.id_ndf_ldf = ?) and ldf.id_mission = miss.id_mission AND ldf.id_statut = stat.id_statut',
            [data.id, data.id, data.id], callback);
    },
    createNotedefrais: function (data, callback) 
    {
        return db.query('Insert into t_note_de_frais(id_collab, mois, annee, total) values(?, ?, ?, 0)',
        [data.id_collab, data.mois, data.annee], callback);
    },
    getNotedefraisMonthYear: function(data, callback)
    {
        return db.query('SELECT id_ndf FROM t_note_de_frais WHERE id_collab = ? AND mois = ? AND annee = ?',
        [data.id_collab, parseInt(data.mois), data.annee], callback);
    },
    getNotedefraisFromIdCollabAndMonth: function(id_collab, month, callback)
    {
        return db.query('SELECT * FROM t_ligne_de_frais WHERE id_ndf IN (SELECT id_ndf FROM t_note_de_frais WHERE id_collab = ? AND mois = ?)', id_collab, month, callback);
    },
    getNotedefraisHistorique:function(data,callback) {
        return db.query('SELECT finalTable.id_ndf, finalTable.mois, finalTable.annee, \
        SUM(finalTable.id_statut) as wait \
        FROM (SELECT ndf.id_ndf, ndf.mois, ndf.annee, newTable.id_ldf, newTable.id_statut \
        FROM t_note_de_frais as ndf \
        JOIN (SELECT ldf.id_ndf, ldf.id_statut, ldf.id_ldf \
              FROM t_ligne_de_frais as ldf, t_note_de_frais as ndf \
              WHERE ldf.id_ndf = ndf.id_ndf AND ldf.id_statut < 11 AND ndf.id_collab = ? \
              UNION \
              SELECT ldf1.id_ndf, ldf1.id_statut, ldf1.id_ldf \
              FROM t_ligne_de_frais_avance as ldf1, t_note_de_frais as ndf \
              WHERE ldf1.id_ndf = ndf.id_ndf AND ldf1.id_ndf_ldf = ndf.id_ndf \
              AND ldf1.id_statut < 11 AND ndf.id_collab = ? \
              UNION \
              SELECT ldf2.id_ndf, ldf2.id_statut, ldf2.id_ldf \
              FROM t_ligne_de_frais_avance as ldf2, t_note_de_frais as ndf \
              WHERE ldf2.id_ndf = ndf.id_ndf AND ldf2.id_ndf_ldf != ndf.id_ndf AND \
              ldf2.id_statut < 6 AND ndf.id_collab = ?\
              UNION \
              SELECT ldf3.id_ndf_ldf as id_ndf, ldf3.id_statut, ldf3.id_ldf \
              FROM t_ligne_de_frais_avance as ldf3, t_note_de_frais as ndf \
              WHERE ldf3.id_ndf != ndf.id_ndf AND ldf3.id_ndf_ldf = ndf.id_ndf AND \
              ldf3.id_statut < 11 AND ndf.id_collab = ? \
             ) as newTable ON ndf.id_ndf = newTable.id_ndf \
        WHERE ndf.id_collab = ? \
        UNION \
        SELECT ndf.id_ndf, ndf.mois, ndf.annee, Null as id_ldf, Null as id_statut \
        FROM t_note_de_frais as ndf \
        WHERE ndf.id_collab = ? ) as finalTable \
        GROUP BY finalTable.mois, finalTable.annee, finalTable.id_ndf ; ',
            [data.id, data.id, data.id, data.id, data.id, data.id], callback);
    }
}

module.exports = Notedefrais;