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


}

module.exports = Mission;