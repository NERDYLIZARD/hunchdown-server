const methodOverride = require('method-override');
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const errorhandler = require('errorhandler');
const errors = require('@feathersjs/errors');
const mongoose = require('mongoose');
require('dotenv').config();
// async function wrapper for handling error without surrounding every await with a try/catch. Reference article: https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
// require('express-async-errors');

const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: process.env.SESSION_KEY, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if (!isProduction) {
  app.use(errorhandler());
}

// Mongoose connection
mongoose.connect(process.env.MONGODB_URI);
if (!isProduction)
  mongoose.set('debug', true);

// Model
require('./models/Card');

// Routes
app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new errors.NotFound('Not Found');
  next(error);
});

/// error handlers

// // ideal error response
// res.json({
//   code: '1234' or 'CamalCaseString',
//   message: error.message,
//   description: "bla bla about code 1234",
//   documentationUrl: "http://urltodoc.com",
// });

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((error, req, res) => {
    console.log(error.stack);

    // error.status for a standard error
    // error.code for an error from @feather/error library
    res.status(error.status || error.code || 500);
    res.json({
      code: error.name,
      message: error.message,
      error: error,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((error, req, res) => {

  // error.status for a standard error
  // error.code for an error from @feather/error library
  res.status(error.status || error.code || 500);

  res.json({
    code: error.name,
    message: error.message,
    error: {},
  });

});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 4000, () => {
  console.log('Listening on port ' + server.address().port);
});
