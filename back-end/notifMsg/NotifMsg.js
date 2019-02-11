var db = require('../db');

var NotifMsg = {
    getDemCongeFromIdNotif: function (data, callback) 
    {
        return db.query('SELECT * FROM t_demande_conge WHERE id_demande_conge = ? AND id_collab = ?', [data.id, data.collab], callback);
    },

    getNdfFromIdNotif: function (data, callback) 
    {
        return db.query('SELECT * FROM t_note_de_frais WHERE id_ndf = ? ND id_collab = ?', [data.id,data.collab], callback);
    },
}

module.exports = NotifMsg;