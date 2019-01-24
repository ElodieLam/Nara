var db = require('../db');

var Lignedefrais = {
    getLignesdefraisFromIdNdf:function(data, callback)
    {
        return db.query('SELECT id_ldf, id_ndf, id_mission, libelle_ldf, montant_ldf, date_ldf, status_ldf, commentaire_ldf, motif_refus, justif_ldf, mission_passee, montant_estime, montant_avance FROM t_ligne_de_frais_avance WHERE id_ndf = ? UNION SELECT id_ldf, id_ndf, id_mission, libelle_ldf, montant_ldf, date_ldf, status_ldf, commentaire_ldf, motif_refus, justif_ldf, Null as mission_passee, Null as montant_estime, Null as montant_avance FROM t_ligne_de_frais WHERE id_ndf = ? ', [data[0], data[0]], callback);
    },
}

module.exports = Lignedefrais;