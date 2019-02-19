var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
var Notif = require('./Notif');

//Chef de service
/*router.get('/demCongeService', function (req, res) {
    Notif.getNotifDemCongeFromIdCds(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
}); 

router.get('/ndfService', function (req, res) {
    Notif.getNotifNdfFromIdCds(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

//Utilisateur simple

router.get('/demConge', function (req, res) {
    Notif.getNotifDemCongeFromId(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.get('/ndf', function (req, res) {
    Notif.getNotifNdfFromId(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

//Compta
router.get('/ndfCompta', function (req, res) {
    Notif.getNotifNdfFromIdCompta(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});*/

router.get('/notifcollab', function (req, res) {
    Notif.getNotifCollab(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.get('/notifservice', function (req, res) {
    Notif.getNotifService(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

module.exports = router;
