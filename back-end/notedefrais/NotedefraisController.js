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

router.post('/notedefraiscreate', function (req, res) {
    Notedefrais.createNotedefraisWithMonth(req.body, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            req.body.id = count.insertId;
            res.json(req.body);
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
