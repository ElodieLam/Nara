var db = require('../db');

var Mission = 
{
    getMissions: function(data, callback)
    {
        return db.query('SELECT * from t_mission',callback);
    },

    getMissionsByMonth: function(data, callback)
    {
        return db.query('SELECT * FROM t_mission WHERE MONTH(date_mission) = ?', [data.mois] ,callback);
    },

    getAllCollaborateurs: function(callback)
    {
        return db.query('SELECT nom_collab, prenom_collab FROM t_collaborateur');
    }
    


}

module.exports = Mission;