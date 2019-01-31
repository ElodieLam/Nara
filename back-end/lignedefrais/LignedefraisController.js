var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
var Lignedefrais = require('./Lignedefrais');

router.get('/lignesdefraisidndf', function (req, res) {
    Lignedefrais.getLignesdefraisFromIdNdf(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.get('/missionsidcollab', function (req, res) {
    Lignedefrais.getMissionsCollabFormIdCollab(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.post('/ajoutlignedefrais', function (req, res) {
    Lignedefrais.createLignedefrais(req.body, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.delete('/supprlignedefrais/:id', function (req, res) {
    Lignedefrais.deleteLignedefrais(req.params, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

module.exports = router;