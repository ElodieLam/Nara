var db = require('../db');

var Demandeconge =
{
    
    getDemandeconges: function(data, callback)
    {
        return db.query('SELECT * from t_demande_conge WHERE id_collab = ?', [data.id], callback);
    },

    

    createDemandeconges: function (Demandeconge, callback) 
    {
        console.log("hey")
        return db.query('Insert into t_demande_conge(id_collab, type_demande_conge, date_debut, debut_matin, date_fin, fin_aprem, status_conge, motif_refus, duree) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [Demandeconge.id_collab, Demandeconge.type_demande_conge, Demandeconge.date_debut, Demandeconge.debut_matin, Demandeconge.date_fin, Demandeconge.fin_aprem, Demandeconge.status_conge, Demandeconge.motif_refus, Demandeconge.duree], callback);
    },

}

module.exports = Demandeconge;