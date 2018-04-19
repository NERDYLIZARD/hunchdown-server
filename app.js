const http = require('http'),
  path = require('path'),
  methods = require('methods'),
  methodOverride = require('method-override');
  logger = require('morgan'),
  express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cors = require('cors'),
  passport = require('passport'),
  errorhandler = require('errorhandler'),
  dotenv = require('dotenv').config(),
  mongoose = require('mongoose');

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

// Mongo connection
mongoose.connect(process.env.MONGODB_URI);
if (!isProduction)
  mongoose.set('debug', true);

// Model
require('./models/Card');



const Card = mongoose.model('Card');

app.get('/api/cards', async (req, res) => {
  const cards = await Card.find();
  res.status(200).json(cards);
});




app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => {
    console.log(err.stack);

    res.status(err.status || 500);

    // ideal error response
    // res.json({
    //   code: "1234",
    //   message: err.message,
    //   description: "bla bla about code 1234",
    //   documentationUrl: "http://urltodoc.com",
    // });

    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });

  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 4000, function () {
  console.log('Listening on port ' + server.address().port);
});
