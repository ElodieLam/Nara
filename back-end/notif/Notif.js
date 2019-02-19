var db = require('../db');

var Notif = {

    //Chef de service
    getNotifDemCongeFromIdCds: function(data, callback)
    {
        return db.query('SELECT dem.id_collab, col.nom_collab as nom, col.prenom_collab as prenom, se.nom_service as service, dem.id_demande_conge, dem.type_demande_conge as type, dem.date_debut as dateD, dem.date_fin as dateF,1 as dem\
        FROM t_demande_conge as dem, t_collaborateur as col, t_service as se\
        WHERE dem.id_collab = col.id_collab AND col.id_serviceCollab = se.id_service AND se.id_chefDeService = ? \
        UNION\
        SELECT dem.id_collab, col.nom_collab as nom, col.prenom_collab as prenom, se.nom_service as service, dem.id_demande_conge, dem.type_demande_conge as type, dem.date_debut as dateD, dem.date_fin as dateF,0 as dem\
        FROM t_modification_conge as dem, t_collaborateur as col, t_service as se\
        WHERE dem.id_collab = col.id_collab AND col.id_serviceCollab = se.id_service AND se.id_chefDeService = ? ', [data.id,data.id], callback);
    },
    getNotifNdfFromIdCds: function(data, callback)
    { 
        return db.query('SELECT notif.id_ndf, notif.id_cds, ndf.id_collab, col.nom_collab as nom, col.prenom_collab as prenom, ndf.mois AS mois, notif.avance as avance, notif.date as date\
        FROM t_notif_ndf AS notif, t_note_de_frais AS ndf, t_collaborateur as col\
        WHERE notif.id_cds = ? AND notif.id_ndf = ndf.id_ndf AND col.id_collab = ndf.id_collab', [data.id,data.id], callback);
    },

    //Utilisateur simple
    getNotifDemCongeFromId: function(data, callback)
    {
        return db.query('SELECT dem.id_collab, se.nom_service as service, dem.id_demande_conge, dem.type_demande_conge as type, dem.status_conge as statut, dem.motif_refus as motif, dem.date_debut as dateD, dem.date_fin as dateF, 1 as dem\
        FROM t_demande_conge as dem, t_collaborateur as col, t_service as se\
        WHERE dem.id_collab = col.id_collab AND col.id_serviceCollab = se.id_service AND dem.id_collab = ?\
        UNION\
        SELECT dem.id_collab, se.nom_service as service, dem.id_demande_conge, dem.type_demande_conge as type, dem.status_conge as statut, dem.motif_refus as motif, dem.date_debut as dateD, dem.date_fin as dateF, 0 as dem\
        FROM t_modification_conge as dem, t_collaborateur as col, t_service as se\
        WHERE dem.id_collab = col.id_collab AND col.id_serviceCollab = se.id_service AND dem.id_collab = ?', [data.id,data.id], callback);
    },

    //Notif from compta
    getNotifNdfFromId: function(data, callback)
    { 
        return db.query('SELECT notif.id_ndf, notif.date as date, notif.avance as avance, notif.acceptee as acceptee, ndf.id_collab, ndf.mois as mois\
        FROM t_notif_ndf_from_compta AS notif,t_note_de_frais AS ndf,t_collaborateur as col\
        WHERE ndf.id_collab = ? AND notif.id_ndf = ndf.id_ndf AND col.id_collab = ndf.id_collab', [data.id], callback);
    },

    //TODO Notif to compta
    /*getNotifNdfFromIdCompta: function(data, callback)
    { 
        return db.query('SELECT notif.id_ndf, notif.date AS date,notif.avance AS avance, notif.acceptee AS acceptee, ndf.id_collab, ndf.mois AS mois\
        FROM t_notif_from_compta AS notif, t_note_de_frais AS ndf\
        WHERE notif.id_ndf = ndf.id_ndf AND ndf.id_collab = ?', [data.id], callback);
    },*/
}

module.exports = Notif;