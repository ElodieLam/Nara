var db = require('../db');

var Collaborateur = {
    
    getCollaborateurs: function(callback)
    {
        return db.query('SELECT * from t_collaborateur', callback);
    },
    getInfoCollab: function(data, callback) 
    {
        return db.query('\
            SELECT col.id_collab, col.nom_collab, col.prenom_collab, ser.nom_service, cong.rtt_restant, cong.rtt_pris, \
            cong.cp_restant, cong.cp_pris, cong.css_pris \
            FROM t_collaborateur as col, t_conge as cong, t_service as ser \
            WHERE col.id_collab = cong.id_collab AND col.id_serviceCollab = ser.id_service AND \
            col.id_collab = ?',
            [data.id], callback);
    },
}

module.exports = Collaborateur;