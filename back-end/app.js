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

var LignedefraisController = require('./lignedefrais/LignedefraisController');
app.use('/lignedefrais', LignedefraisController);

var LoginController = require('./login/LoginController');
app.use('/login', LoginController);

var NotifController = require('./notif/NotifController');
app.use('/notif', NotifController);

var NotifMsgController = require('./notifMsg/NotifMsgController');
app.use('/notifMsg', NotifMsgController);

module.exports = app;