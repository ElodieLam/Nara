var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var Login = require('./Login');

router.get('/loginid', function (req, res) 
{
    Login.getUserDetailsFromUsername(req.query, function(err, rows)
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