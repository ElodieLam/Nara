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

    getAllCollaborateurs: function(data, callback)
    {
        return db.query('SELECT col.id_collab, col.nom_collab, col.prenom_collab, ser.nom_service \
            FROM t_collaborateur as col \
            JOIN t_service as ser ON col.id_serviceCollab = ser.id_service', callback);
    }

}

module.exports = Mission;