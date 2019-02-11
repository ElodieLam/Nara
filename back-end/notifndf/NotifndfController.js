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
});

router.post('/createorupdatenotifndf', function (req, res) {
    Notifndf.createNotifNdf(req.body);
});

router.post('/createorupdatenotifndfavance', function (req, res) {
    Notifndf.createNotifNdfAvance(req.body);
});

router.post('/createnotifndftocompta', function (req, res) {
    Notifndf.createNotifNdfToCompta(req.body, function (err, count) {
        if (err) res.status(400).json(err);
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.post('/createnotifndftocomptaavance', function (req, res) {
    Notifndf.createNotifNdfToComptaAvance(req.body, function (err, count) {
        if (err) res.status(400).json(err);
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.post('/createnotifndffromcomptaacc', function (req, res) {
    Notifndf.createNotifNdfFromComptaAcc(req.body, function (err, count) {
        if (err) res.status(400).json(err);
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.post('/createnotifndffromcomptaref', function (req, res) {
    Notifndf.createNotifNdfFromComptaRef(req.body, function (err, count) {
        if (err) res.status(400).json(err);
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.post('/createnotifndffromcomptaavanceacc', function (req, res) {
    Notifndf.createNotifNdfFromComptaAvanceAcc(req.body, function (err, count) {
        if (err) res.status(400).json(err);
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.post('/createnotifndffromcomptaavanceref', function (req, res) {
    Notifndf.createNotifNdfFromComptaAvanceRef(req.body, function (err, count) {
        if (err) res.status(400).json(err);
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

module.exports = router;