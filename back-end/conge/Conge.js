var db = require('../db');

var Conge = 
{
    //Fonction permettant d'avoir les informations de congés d'un collaborateur
    getConges: function(Conge, callback)
    {
        return db.query('SELECT * from t_conge WHERE id_collab = ?', [Conge.id], callback);
    },

    //Fonction mettant à jour les informations de congés d'un collaborateur
    createConges: function (Conge, callback) 
    {
        return db.query('UPDATE t_conge SET rtt_restant = ?, rtt_pris = ?, cp_restant = ?, cp_pris = ?, css_pris = ? WHERE id_collab = ?',
        [Conge.rtt_restant, Conge.rtt_pris, Conge.cp_restant, Conge.cp_pris, Conge.css_pris, Conge.id_collab], callback);
    },

}

module.exports = Conge;