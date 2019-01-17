var db = require('../db');
var Collaborateur = require('../collaborateur/Collaborateur')

var Conge = {
    
    getConges: function(Conge, callback)
    {
        return db.query('SELECT * from t_conge WHERE id_collab = ?', Collaborateur.id_collab, callback);
    },

    creatematiere: function (Matiere, callback) 
    {
        return db.query('Insert into t_matiere(libelle, coefficient) values(?, ?)',[Matiere.libelle, Matiere.coefficient], callback);
    },

}

module.exports = Matiere;