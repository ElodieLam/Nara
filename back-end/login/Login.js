var db = require('../db');

var Login = {
    
    getUserDetailsFromUsername: function(data, callback)
    {
        return res = db.query(
            'SELECT col.id_collab, se.id_service, se.nom_service, se.id_chefDeService,  \
            col.nom_collab, col.prenom_collab \
            from t_collaborateur as col, t_service as se  \
            WHERE col.nom_collab = ? and col.password = SHA2(?,256) AND se.id_service = col.id_serviceCollab', 
            [data.nom, data.pass],  callback);
    },
}

module.exports = Login;