const methodOverride = require('method-override');
const logger = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const errorHandler = require('./middlewares/error-handler');
const { NotFound } = require('./libs/errors');
// importing variables in .env file into a global object process.env
require('dotenv').config();
const keys = require('./config');
// async function wrapper for handling error without surrounding every await with a try/catch. Reference article: https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
require('express-async-errors');

const isDevelopment = process.env.NODE_ENV === 'development';

// Create global app object
const app = express();

app.use(cors());

/**
 * Normal express config defaults
 */
if (isDevelopment)
  app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: keys.sessionKey, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));


/**
 * Mongoose connection
 */
mongoose.connect(keys.mongoURI);
if (isDevelopment)
  mongoose.set('debug', true);

/**
 * Models Registration
 */
require('./models/box');
require('./models/hunch');

/**
 * Routers
 */
app.use(require('./routes'));


/**
 * catch 404 and forward to error handler
 */
app.use((req, res, next) => {
  next(new NotFound());
});


/**
 * Centralized error handlers
 */
app.use(errorHandler);


// finally, let's start export our app...
module.exports = app;
