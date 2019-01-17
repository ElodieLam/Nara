var express = require('express');
var app = express();

var CongeController = require('./conge/CongeController');
app.use('/conge', CongeController);


module.exports = app;