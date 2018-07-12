// The error handler middleware that handles all errors
// and respond to the client
const {
  CustomError,
  UnprocessableEntity,
  InternalServerError,
} = require('../libs/errors');
const { map } = require('lodash');

module.exports = function errorHandler (err, req, res, next) { // eslint-disable-line no-unused-vars
  // In case of a CustomError class, use it's data
  // Otherwise try to identify the type of error (mongoose validation, mongodb unique, ...)
  // If we can't identify it, respond with a generic 500 error
  let responseErr = err instanceof CustomError ? err : null;

  // Handle errors created with 'http-errors' or similar that have a status property
  if (err.status && typeof err.status === 'number') {
    responseErr = new CustomError();
    responseErr.status = err.status;
    responseErr.name = err.name;
    responseErr.message = err.message;
  }

  // Handle errors by express-validator
  if (Array.isArray(err) && err[0].param && err[0].msg) {
    responseErr = new UnprocessableEntity('invalidRequestParams');
    responseErr.errors = err.map((paramErr) => {
      return {
        message: paramErr.msg,
        field: paramErr.param,
        value: paramErr.value,
      };
    });
  }

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    const model = err.message.split(' ')[0];
    responseErr = new UnprocessableEntity(`${model} validation failed`);
    responseErr.errors = map(err.errors, (mongooseErr) => {
      return {
        message: mongooseErr.message,
        field: mongooseErr.path,
        value: mongooseErr.value,
      };
    });
  }

  if (!responseErr || responseErr.status >= 500) {
    // Try to identify the error...
    // ...
    // Otherwise create an InternalServerError and use it
    // we don't want to leak anything, just a generic error message
    // Use it also in case of identified errors but with status === 500
    responseErr = new InternalServerError();
  }


  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }

  let jsonRes = {
    message: responseErr.message,
  };

  if (responseErr.errors) {
    jsonRes.errors = responseErr.errors;
  }

  // In some occasions like when invalid JSON is supplied `res.respond` might be not yet avalaible,
  // in this case we use the standard res.status(...).json(...)
  return res.status(responseErr.status).json(jsonRes);
};
