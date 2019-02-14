var db = require('../db');

var Notedefrais = {
    getNotesdefraisFromIdCollab: function(data, callback)
    {
        return db.query('SELECT * FROM t_note_de_frais WHERE id_collab = ?', [data.id], callback);
    },
    getLignesdefraisresumeFromIdNdf:function(data, callback)
    {
        return db.query('SELECT miss.nom_mission, ldf.libelle_ldf, ldf.status_ldf, FALSE as avance \
            from t_ligne_de_frais as ldf, t_mission as miss \
            WHERE ldf.id_ndf = ? and ldf.id_mission = miss.id_mission\
            UNION \
            SELECT miss.nom_mission, ldf.libelle_ldf, ldf.status_ldf, TRUE as avance \
            from t_ligne_de_frais_avance as ldf, t_mission as miss \
            WHERE ldf.id_ndf = ? and ldf.id_mission = miss.id_mission',
            [data.id, data.id], callback);
    },
    createNotedefraisWithMonth: function (data, callback) 
    {
        return db.query('Insert into t_note_de_frais(id_collab, mois) values(?, ?)',[data.id_collab, data.mois], callback);
    },
    createNotedefrais: function (data, callback) 
    {
        return db.query('Insert into t_note_de_frais(id_collab, mois, annee, total) values(?, ?, ?, 0)',
        [data.id_collab, data.mois, data.annee], callback);
    },
    getNotedefraisMonthYear: function(data, callback)
    {
        console.log(data)
        return db.query('SELECT id_ndf FROM t_note_de_frais WHERE id_collab = ? AND mois = ? AND annee = ?',
        [data.id_collab, parseInt(data.mois), data.annee], callback);
    },
    getNotedefraisFromIdCollabAndMonth: function(id_collab, month, callback)
    {
        return db.query('SELECT * FROM t_ligne_de_frais WHERE id_ndf IN (SELECT id_ndf FROM t_note_de_frais WHERE id_collab = ? AND mois = ?)', id_collab, month, callback);
    },
}

module.exports = Notedefrais;