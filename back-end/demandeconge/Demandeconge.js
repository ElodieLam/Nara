var db = require('../db');

var Demandeconge =
{
    
    getDemandeconges: function(data, callback)
    {
        return db.query('SELECT * from t_demande_conge WHERE id_collab = ?', [data.id], callback);
    },
    
    // // // // getTest:function(data, callback)
    // // // // {
    // // // //     console.log(data);
    // // // //     return db.query('SELECT * from table WHERE id_qq = ?', [data[0]], callback);
    // // // // }

    getDemandeService: function(data, callback)
    {
       return db.query('SELECT * FROM t_demande_conge WHERE id_collab IN (SELECT id_collab FROM t_collaborateur WHERE id_serviceCollab = (SELECT id_serviceCollab FROM t_collaborateur WHERE id_collab = ?) AND id_collab NOT LIKE ?)', [data.id, data.id], callback)
    },

    getDemandeRH: function(data, callback)
    {
        return db.query('SELECT * FROM t_demande_conge WHERE id_collab IN (SELECT id_collab FROM t_collaborateur WHERE id_serviceCollab NOT LIKE (SELECT id_serviceCollab FROM t_collaborateur WHERE id_collab = ?))', [data.id], callback)
    },

    updateService: function(Demandeconge, callback)
    {
        date = new Date();
        return db.query('UPDATE t_demande_conge SET status_conge = ?, date_demande = ?, motif_refus = ? WHERE id_demande_conge = ?',
        [Demandeconge.status_conge, date, Demandeconge.motif_refus, Demandeconge.id_demande_conge], callback);
    },

    createDemandeconges: function (Demandeconge, callback) 
    {
        date_debut = new Date(Demandeconge.date_debut)
        date_fin = new Date(Demandeconge.date_fin)
        date = new Date();
        return db.query('Insert into t_demande_conge(id_collab, date_demande, type_demande_conge, date_debut, debut_matin, date_fin, fin_aprem, status_conge, motif_refus, duree) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [Demandeconge.id_collab, date, Demandeconge.type_demande_conge, date_debut, Demandeconge.debut_matin, date_fin, Demandeconge.fin_aprem, Demandeconge.status_conge, Demandeconge.motif_refus, Demandeconge.duree], callback);
    },

}

module.exports = Demandeconge;