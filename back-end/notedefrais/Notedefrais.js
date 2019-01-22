var db = require('../db');

var Notedefrais = {
    getNotesdefraisFromIdCollab: function(data, callback)
    {
        return db.query('SELECT * FROM t_note_de_frais WHERE id_collab = ?', [data[0]], callback);
    },
    getLignesdefraisFromIdNdf: function(data, callback)
    {
        return db.query('SELECT * from t_ligne_de_frais WHERE id_ndf = ?', [data[0]], callback);
    },
    getMissionFromId: function(data, callback)
    {
        return db.query('SELECT nom_mission FROM t_mission WHERE id_mission = ?', [data[0]], callback);
    },

    
    createNotedefraisWithMonth: function (data, callback) 
    {
        return db.query('Insert into t_note_de_frais(id_collab, mois) values(?, ?)',[data.id_collab, data.mois], callback);
    },
    getNotedefraisFromIdCollabAndMonth: function(id_collab, month, callback)
    {
        return db.query('SELECT * FROM t_ligne_de_frais WHERE id_ndf IN (SELECT id_ndf FROM t_note_de_frais WHERE id_collab = ? AND mois = ?)', id_collab, month, callback);
    },
    
    
}

module.exports = Notedefrais;