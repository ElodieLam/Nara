var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
var Notifndf = require('./Notifndf');

router.get('/getnotifndf', function (req, res) {
    Notifndf.getNotifNdfFromId(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
    res.end();
});

module.exports = router;