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

router.post('/updatelignedefrais', function (req, res) {
    Lignedefrais.updateLignedefrais(req.body, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.post('/updatelignedefraisavance', function (req, res) {
    Lignedefrais.updateLignedefraisAvance(req.body, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.post('/ajoutavance', function (req, res) {
    Lignedefrais.createAvance(req.body, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.delete('/suppravance/:id', function (req, res) {
    Lignedefrais.deleteAvance(req.params, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.post('/updatestatutlignedefrais', function (req, res) {
    Lignedefrais.updateStatutLignedefrais(req.body, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            req.body.id = count.insertId;
            res.json(req.body);
        }
    });
});

router.post('/updatestatutavance', function (req, res) {
    Lignedefrais.updateStatutAvance(req.body, function (err, count) {
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