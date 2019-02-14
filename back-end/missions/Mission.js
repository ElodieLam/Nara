var db = require('../db');

var Mission = 
{
    getMissions: function(data, callback)
    {
        return db.query('SELECT * from t_mission',callback);
    },


}

module.exports = Mission;