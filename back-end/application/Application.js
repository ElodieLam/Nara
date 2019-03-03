var db = require('../db');

var Application =
{
    updateApp: function(data, callback)
    {
        var dateJS = new Date()
        var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        var date =  [year, month, day].join('-');
        return db.query('\
        DELETE ldf \
        FROM t_ligne_de_frais_avance as ldf \
        INNER JOIN t_mission as miss ON ldf.id_mission = miss.id_mission \
        WHERE miss.date_mission <= ? AND ldf.id_statut < 6  ;\
        INSERT INTO t_note_de_frais(id_collab, annee, mois, total) \
        SELECT id_collab, year, month, 0 \
        FROM (SELECT  YEAR(?) AS year, MONTH(?) AS month, ndf.id_collab, av.id_ldf \
            FROM t_ligne_de_frais_avance as av \
            JOIN t_mission as miss ON av.id_mission = miss.id_mission \
            JOIN t_note_de_frais as ndf ON ndf.id_ndf = av.id_ndf \
            WHERE miss.date_mission > ? AND \
                STR_TO_DATE(CONCAT(?,\',\',?,\',\',\'01\'),\'%Y,%m,%d\') \
                > STR_TO_DATE(CONCAT(ndf.annee,\',\', ndf.mois,\',\',\'01\'),\'%Y,%m,%d\') \
                AND av.id_statut < 5) as tableTest \
        ON DUPLICATE KEY UPDATE \
            total = 0 ; \
        UPDATE t_ligne_de_frais_avance as av \
        INNER JOIN (SELECT  YEAR(?) AS year, MONTH(?) AS month, ndf.id_collab, av.id_ldf \
            FROM t_ligne_de_frais_avance as av \
            JOIN t_mission as miss ON av.id_mission = miss.id_mission \
            JOIN t_note_de_frais as ndf ON ndf.id_ndf = av.id_ndf \
            WHERE miss.date_mission > ? AND \
                STR_TO_DATE(CONCAT(?,\',\',?,\',\',\'01\'),\'%Y,%m,%d\') \
                > STR_TO_DATE(CONCAT(ndf.annee,\',\', ndf.mois,\',\',\'01\'),\'%Y,%m,%d\') \
                AND av.id_statut < 5) as tableTest ON av.id_ldf = tableTest.id_ldf \
        SET av.id_ndf = ( \
            SELECT id_ndf \
            FROM t_note_de_frais \
            WHERE id_collab = tableTest.id_collab AND mois = tableTest.month AND annee = tableTest.year), \
        av.id_ndf_ldf = ( \
            SELECT id_ndf \
            FROM t_note_de_frais \
            WHERE id_collab = tableTest.id_collab AND mois = tableTest.month AND annee = tableTest.year) ; \
        ', [dateJS, date, date, date, year, month, date, date, date, year, month], callback);
    },
}

module.exports = Application;
