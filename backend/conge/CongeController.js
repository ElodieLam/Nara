var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var Conge = require('./Conge');

router.get('/', function (req, res) 
{
    Conge.getConges(function(err, rows)
    {
        if(err) 
        {
            res.status(400).json(err);
            console.log("t'es un malade bernard");
        }
        else
        {
            console.log("comment tu vas ?");
            res.json(rows);
        }
    });
});

/*
router.post('/', function (req, res) 
{
    Conge.createConge(req.body, function(err, count){
        if(err)
        {
            res.status(400).json(err);
        }
        else
        {
            res.json(req.body);
        }
    });
});*/

module.exports = router;
