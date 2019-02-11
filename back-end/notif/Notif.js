var db = require('../db');

var Notif = {
    getNotifDemCongeFromIdCollab: function(data, callback)
    {
        console.log(data.id);
        return db.query('SELECT * FROM `t_notif_dem_conge` WHERE id_collab = ?', [data.id], callback);
    },
    getNotifModCongeFromIdCollab:function(data, callback)
    {
        return db.query('SELECT * FROM `t_notif_mod_conge` WHERE id_collab = ?', [data.id], callback);
    },
    getNotifNdfFromIdCollab: function (data, callback) 
    {
        return db.query('SELECT * FROM `t_notif_ndf` WHERE id_collab = ?', [data.id], callback);
    },
}

module.exports = Notif;