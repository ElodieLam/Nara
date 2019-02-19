var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
var Gestionndf = require('./Gestionndf');

router.get('/getndfidcds', function (req, res) {
    Gestionndf.getNdfFromIdCds(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.get('/getldfidndfidcds', function (req, res) {
    Gestionndf.getLdfFromIdCollabIdNdf(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.post('/updateldf', function (req, res) {
    Gestionndf.updateGestionLignedefrais(req.body, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.post('/updateavance', function (req, res) {
    Gestionndf.updateGestionAvance(req.body, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

// maj d'une ligne de frais, avec maj de la notif from/to Compta
router.post('/updateldfnotiftoandfromcompta', function (req, res) {
    Gestionndf.updateLignedefraisAndNotifToAndFromCompta(req.body, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(req.body);
        }
    });
});

// maj d'une ligne de frais, avec maj de la notif from/to Compta
router.post('/updateavancenotiftoandfromcompta', function (req, res) {
    Gestionndf.updateAvanceAndNotifToAndFromCompta(req.body, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(req.body);
        }
    });
});

module.exports = router;