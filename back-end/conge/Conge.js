var db = require('../db');

var Conge = {
    
    getConges: function(Conge, callback)
    {
        console.log(Conge)
        return db.query('SELECT * from t_conge WHERE id_collab = ?', [Conge.id_collab], callback);
    },

    /*

    creatematiere: function (Conge, callback) 
    {
        return db.query('Insert into t_conge(libelle, coefficient) values(?, ?)',[Matiere.libelle, Matiere.coefficient], callback);
    },*/

}

module.exports = Conge;