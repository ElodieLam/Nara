var db = require('../db');

var Demandeconge =
{
    
    getDemandeconges: function(Demandeconge, callback)
    {
        console.log(Demandeconge);
        return db.query('SELECT * from t_demande_conge WHERE id_collab = ?', [Demandeconge.id_collab], callback);
    },

    /*

    creatematiere: function (Conge, callback) 
    {
        return db.query('Insert into t_conge(libelle, coefficient) values(?, ?)',[Matiere.libelle, Matiere.coefficient], callback);
    },*/

}

module.exports = Demandeconge;