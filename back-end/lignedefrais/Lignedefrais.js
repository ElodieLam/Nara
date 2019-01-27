var db = require('../db');

var Lignedefrais = {
    getLignesdefraisFromIdNdf:function(data, callback)
    {
        return db.query(
            'SELECT av.id_ldf, av.id_ndf, miss.nom_mission, av.libelle_ldf, av.montant_ldf, \
            av.date_ldf, av.status_ldf, av.commentaire_ldf, av.motif_refus, av.justif_ldf, \
            av.mission_passee, av.montant_estime, av.montant_avance \
            FROM t_ligne_de_frais_avance as av, t_mission as miss \
            WHERE av.id_ndf = ? AND av.id_mission = miss.id_mission\
            UNION \
            SELECT ldf.id_ldf, ldf.id_ndf, miss.nom_mission, ldf.libelle_ldf, ldf.montant_ldf, \
            ldf.date_ldf, ldf.status_ldf, ldf.commentaire_ldf, ldf.motif_refus, ldf.justif_ldf, \
            Null as mission_passee, Null as montant_estime, Null as montant_avance \
            FROM t_ligne_de_frais as ldf, t_mission as miss \
            WHERE ldf.id_ndf = ? AND ldf.id_mission = miss.id_mission', 
            [data[0], data[0]], callback);
    },
}

module.exports = Lignedefrais;