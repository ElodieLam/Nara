var db = require('../db');

var Notifndf = {
    getNotifNdfFromId: function(data, callback)
    {
        return db.query('SELECT * FROM t_notif_ndf WHERE id_cds = ?', [data.id], callback);
    },
}
module.exports = Notifndf;
