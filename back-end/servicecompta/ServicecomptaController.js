var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
var Servicecompta = require('./Servicecompta');

router.get('/getndftocompta', function (req, res) {
    Servicecompta.getNdfToCompta(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.get('/getndftocomptaidndf', function (req, res) {
    Servicecompta.getNdfToComptaIdNdf(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.post('/accepterlignes', function (req, res) {
    Servicecompta.accepterLignes(req.body, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(req.body);
        }
    });
});

router.post('/refuserlignes', function (req, res) {
    Servicecompta.refuserLignes(req.body, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(req.body);
        }
    });
});

router.post('/accepteravance', function (req, res) {
    Servicecompta.accepterAvance(req.body, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(req.body);
        }
    });
});

router.post('/refuseravance', function (req, res) {
    Servicecompta.refuserAvance(req.body, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(req.body);
        }
    });
});

module.exports = router;