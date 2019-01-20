var express = require('express');
var app = express();
var cors = require('cors');


app.use(cors());

var NotedefraisController = require('./notedefrais/NotedefraisController');
app.use('/notedefrais', NotedefraisController);


module.exports = app;