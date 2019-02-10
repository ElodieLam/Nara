var db = require('../db');

var Login = {
    
    getUserDetailsFromUsername: function(data, callback)
    {
        console.log("Get user details");
        
        return res = db.query('SELECT * from t_collaborateur WHERE nom_collab = ? and password = SHA2(?,256)', [data.nom, data.pass],  callback);
        
    },


}

module.exports = Login;