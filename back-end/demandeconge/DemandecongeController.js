var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var Demandeconge = require('./Demandeconge');

router.get('/demandecongesid', function (req, res) 
{
    Demandeconge.getDemandeconges(req.query, function(err, rows)
    {
        if(err) 
        {
            res.status(400).json(err);
        }
        else
        {
            res.json(rows);
        }
    });
});

router.get('/demandeservice', function (req, res) 
{
    Demandeconge.getDemandeService(req.query, function(err, rows)
    {
        if(err) 
        {
            res.status(400).json(err);
        }
        else
        {
            res.json(rows);
        }
    });
});

router.get('/demandecollab', function (req, res) {
    Demandeconge.getDemandeServiceFromCollab(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

router.get('/demanderh', function (req, res) 
{
    Demandeconge.getDemandeRH(req.query, function(err, rows)
    {
        if(err) 
        {
            res.status(400).json(err);
        }
        else
        {
            res.json(rows);
        }
    });
});


router.post('/demandecongescreate', function (req, res) 
{
    Demandeconge.createDemandeconges(req.body, function(err, count){
        if(err)
        {
            res.status(400).json(err);
        }
        else
        {
            res.json(req.body);
        }
    });
});

router.post('/deletedemande', function (req, res) {
    Demandeconge.deleteDemandeconge(req.body, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(req.body);
        }
    });
});

router.post('/updateservice', function (req, res) 
{
    Demandeconge.updateService(req.body, function(err, count){
        if(err)
        {
            res.status(400).json(err);
        }
        else
        {
            res.json(req.body);
        }
    });
});

module.exports = router;
