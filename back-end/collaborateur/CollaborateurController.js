var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var Collab = require('./Collaborateur');

router.get('/collab', function (req, res) 
{
    Collab.getCollaborateurs(function(err, rows)
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

router.get('/infocollab', function (req, res) 
{
    Collab.getInfoCollab(req.query, function(err, rows)
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


module.exports = router;
