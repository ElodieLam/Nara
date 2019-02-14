var express = require('express');
var app = express();
var cors = require('cors');


app.use(cors());

var NotedefraisController = require('./notedefrais/NotedefraisController');
app.use('/notedefrais', NotedefraisController);

var CongeController = require('./conge/CongeController');
app.use('/conge', CongeController);

var DemandecongeController = require('./demandeconge/DemandecongeController');
app.use('/demandeconge', DemandecongeController);

var MissionController = require('./missions/MissionController');
app.use('/missions', MissionController);



module.exports = app;