const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('express-flash');
const cookieSession = require('cookie-session');
const passport = require('passport');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');

//important to call model first, before I try to run passport
require('../models/User');
require('./passport-config');

const keys = require('./keys/keys');

module.exports = {
  init(app, express) {
    mongoose.connect(keys.mongoURI);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressValidator());
    app.use(
      cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
      })
    );
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      next();
    });
    app.use(express.static(path.join(__dirname, '..', 'assets')));
    app.use(logger('dev'));
  }
};
