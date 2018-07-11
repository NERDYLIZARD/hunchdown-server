
// Base class for custom application errors
// It extends Error and capture the stack trace
class CustomError extends Error {
  constructor () {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}


// We specify an status for all errors so that they can be used in the API too
class NotAuthorized extends CustomError {
  constructor (customMessage) {
    super();
    this.name = this.constructor.name;
    this.status = 401;
    this.message = customMessage || 'Not authorized.';
  }
}

class BadRequest extends CustomError {
  constructor (customMessage) {
    super();
    this.name = this.constructor.name;
    this.status = 400;
    this.message = customMessage || 'Bad request.';
  }
}

class NotFound extends CustomError {
  constructor (customMessage) {
    super();
    this.name = this.constructor.name;
    this.status = 404;
    this.message = customMessage || 'Not found.';
  }
}

class UnprocessableEntity extends CustomError {
  constructor (customMessage) {
    super();
    this.name = this.constructor.name;
    this.status = 422;
    this.message = customMessage || 'Unprocessable Entity.';
  }
}

class InternalServerError extends CustomError {
  constructor (customMessage) {
    super();
    this.name = this.constructor.name;
    this.status = 500;
    this.message = customMessage || 'An unexpected error occurred.';
  }
}

class NotImplementedError extends CustomError {
  constructor (str) {
    super();
    this.name = this.constructor.name;

    this.message = `Method: '${str}' not implemented`;
  }
}


module.exports = {
  CustomError,
  NotAuthorized,
  NotFound,
  BadRequest,
  UnprocessableEntity,
  NotImplementedError,
  InternalServerError
};