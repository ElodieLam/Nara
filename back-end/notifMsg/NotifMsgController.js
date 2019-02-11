var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
var NotifMsg = require('./NotifMsg');

router.get('/demConge', function (req, res) {
    NotifMsg.getDemCongeFromIdNotif(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});


router.get('/ndf', function (req, res) {
    NotifMsg.getNdfFromIdNotif(req.query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json(rows);
        }
    });
});

module.exports = router;
