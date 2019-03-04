var express = require('express');
var app = express();
var cors = require('cors');


app.use(cors());

var ApplicationController = require('./application/ApplicationController');
app.use('/application', ApplicationController);

var NotedefraisController = require('./notedefrais/NotedefraisController');
app.use('/notedefrais', NotedefraisController);

var CongeController = require('./conge/CongeController');
app.use('/conge', CongeController);

var DemandecongeController = require('./demandeconge/DemandecongeController');
app.use('/demandeconge', DemandecongeController);

var CollaborateurController = require('./collaborateur/CollaborateurController');
app.use('/collaborateur', CollaborateurController);
var MissionController = require('./missions/MissionController');
app.use('/missions', MissionController);

var LignedefraisController = require('./lignedefrais/LignedefraisController');
app.use('/lignedefrais', LignedefraisController);

var LoginController = require('./login/LoginController');
app.use('/login', LoginController);

var NotifndfController = require('./notifndf/NotifndfController');
app.use('/notifndf', NotifndfController);

var GestionndfController = require('./gestionndf/GestionndfController');
app.use('/gestionndf', GestionndfController);

var ServicecomptaController = require('./servicecompta/ServicecomptaController');
app.use('/servicecompta', ServicecomptaController);

var NotifController = require('./notif/NotifController');
app.use('/notif', NotifController);


module.exports = app;