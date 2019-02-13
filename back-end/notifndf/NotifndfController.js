var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
var Notifndf = require('./Notifndf');

router.get('/getnotifndf', function (req, res) {
    Notifndf.getNotifNdfFromId(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
    res.end();
});

router.post('/createorupdatenotifndf', async function (req, res) {
    Notifndf.createNotifNdf(req.body);
    res.end();
});

router.post('/createorupdatenotifndfavance', function (req, res) {
    Notifndf.createNotifNdfAvance(req.body);
    res.end();
});

router.post('/createorupdateallnotifications', function (req, res) {
        Notifndf.createOrUpdateAllNotifications(req.body, function (err, count) {
        if (err) res.status(400).json(err);
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

module.exports = router;