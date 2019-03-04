var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var Application = require('./Application');

router.post('/updateapp', function (req, res) 
{
    Application.updateApp(req.body, function(err, count){
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