var db = require('../db');

var Conge = 
{
    getConges: function(Conge, callback)
    {
        return db.query('SELECT * from t_conge WHERE id_collab = ?', [Conge.id], callback);
    },

    createConges: function (Conge, callback) 
    {
        console.log(Conge.rtt_restant)
        return db.query('UPDATE t_conge SET rtt_restant = ?, rtt_pris = ?, cp_restant = ?, cp_pris = ?, css_pris = ? WHERE id_collab = ?',
        [Conge.rtt_restant, Conge.rtt_pris, Conge.cp_restant, Conge.cp_pris, Conge.css_pris, Conge.id_collab], callback);
    },

}

module.exports = Conge;