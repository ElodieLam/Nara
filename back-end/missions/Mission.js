var db = require('../db');

var Mission = 
{
    getMissions: function(data, callback)
    {
        return db.query(' \
        SELECT miss.id_mission, miss.id_chef, miss.nom_mission, miss.date_mission, \
        miss.ouverte, table1.cnt FROM t_mission as miss \
        LEFT JOIN (\
            SELECT table2.id_mission, SUM(table2.cnt) as cnt \
            FROM (\
                SELECT miss.id_mission, COUNT(miss.id_mission) as cnt \
                FROM t_ligne_de_frais as ldf \
                JOIN t_mission as miss ON ldf.id_mission = miss.id_mission \
                WHERE miss.id_chef = ? \
                GROUP BY(miss.id_mission) \
                UNION \
                SELECT miss.id_mission, COUNT(miss.id_mission) as cnt \
                FROM t_ligne_de_frais_avance as ldf \
                JOIN t_mission as miss ON ldf.id_mission = miss.id_mission \
                WHERE miss.id_chef = ? \
                GROUP BY(miss.id_mission)\
            ) as table2 \
            GROUP BY(table2.id_mission)\
        ) as table1 ON table1.id_mission = miss.id_mission AND miss.id_chef = ? ;',
        [data.id, data.id, data.id], callback);
    },

    getMissionsByMonth: function(data, callback)
    {
        return db.query('SELECT * FROM t_mission WHERE MONTH(date_mission) = ?', [data.mois] ,callback);
    },

    getAllCollaborateurs: function(data, callback)
    {
        return db.query('SELECT col.id_collab, col.nom_collab, col.prenom_collab, ser.nom_service \
            FROM t_collaborateur as col \
            JOIN t_service as ser ON col.id_serviceCollab = ser.id_service', callback);
    },

    createMission(data, callback) {
        date = new Date(data.date)
        sql = 'INSERT INTO t_mission(id_chef, date_mission, ouverte, nom_mission) \
        VALUES(?, ?, 1, ?) ; '
        data.collab.forEach(element => {
            sql += 'INSERT INTO t_missionCollab(id_collab, id_mission) \
            VALUES( ' + element + ', ( \
                SELECT id_mission FROM t_mission WHERE id_chef = ' + data.id + ' \
                AND nom_mission = \'' + data.nom + '\')) ;'
        });
        return db.query(sql, [data.id, date, data.nom], callback);
    },

    supprimerMission(data, callback)
    {
        return db.query('DELETE FROM t_missionCollab WHERE id_mission = ? ; \
        DELETE FROM t_mission WHERE id_mission = ? ; ', 
        [data.id, data.id], callback);
    },

    cloreMission(data, callback)
    {
        return db.query('UPDATE t_mission SET ouverte = 0 WHERE id_mission = ?',[data.id], callback);
    },

    ouvrirMission(data, callback)
    {
        return db.query('UPDATE t_mission SET ouverte = 1 WHERE id_mission = ?',[data.id], callback);
    }

}

module.exports = Mission;