var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
var Notedefrais = require('./Notedefrais');

router.get('/notedefraisid', function (req, res) {
    Notedefrais.getNotesdefraisFromIdCollab(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.get('/lignesdefraisresumeidndf', function (req, res) {
    Notedefrais.getLignesdefraisresumeFromIdNdf(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.get('/nommission', function (req, res) {
    Notedefrais.getMissionFromId(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.post('/createnotedefrais', function (req, res) {
    Notedefrais.createNotedefrais(req.body, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.get('/getnotedefraismonthyear', function (req, res) {
    Notedefrais.getNotedefraisMonthYear(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.get('/getnotedefraishistorique', function (req, res) {
    Notedefrais.getNotedefraisHistorique(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.get('/notedefraisidmois', function (req, res) {
    Notedefrais.getNotedefraisFromIdCollabAndMonth(req.body, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

module.exports = router;
