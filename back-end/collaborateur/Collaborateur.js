var db = require('../db');

var Collaborateur = {
    
    getCollaborateurs: function(callback)
    {
        return db.query('SELECT * from t_collaborateur', callback);
    },

    createCollaborateur: function (Collaborateur, callback) 
    {
        return db.query('Insert into t_collaborateur(nom_collab, prenom_collab) values(?, ?)',[ Collaborateur.nom_collab, Collaborateur.prenom_collab], callback);
    },

}

module.exports = Collaborateur;