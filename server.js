var express  = require('express');
var app      = express();
var port     = process.env.PORT || 6060;
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./config/database.js');
var db
// let zillowApiKey = require('./config/zillowApiKey.js')
// console.log("zillowApiKey.zillowApiKey",zillowApiKey.zillowApiKey);

// configuration ===============================================================
// configDB object and url property
mongoose.connect(configDB.url, { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err)
  db = database
  // require('./app/routes.js')(app, passport, db);
  require('./app/routes.js')(app, passport, db, ObjectId);

}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2019b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
