var db = require('../db');

var Application =
{
    
    updateApp: function(data, callback)
    {
        var date = new Date()
        return db.query('\
        DELETE ldf \
        FROM t_ligne_de_frais_avance as ldf \
        INNER JOIN t_mission as miss ON ldf.id_mission = miss.id_mission \
        WHERE miss.date_mission <= ? AND ldf.id_statut < 6  \
        ', [date], callback);
    },
}

module.exports = Application;