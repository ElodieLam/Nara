var db = require('../db');

var Conge = {
    
    getConges: function(callback)
    {
        return db.query('SELECT * from t_conge', callback);
    },

    /*

    creatematiere: function (Conge, callback) 
    {
        return db.query('Insert into t_conge(libelle, coefficient) values(?, ?)',[Matiere.libelle, Matiere.coefficient], callback);
    },*/

}

module.exports = Conge;