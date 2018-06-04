/**
 * Created on 24-Apr-18.
 */
const { FeathersError } = require('@feathersjs/errors');

const errorCodes = {
  MISSING: 'MISSING',
  MISSING_FIELD: 'MISSING_FIELD',
  INVALID: 'INVALID',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
};

/**
 * A class of custom validation error extended from FeatherErrors
 */
class ValidationError extends FeathersError {

  constructor(arg1, arg2) {
    // default constructor: ValidationError()
    let message = 'Validation Failed';
    let data = null;

    // construct with only errors: ValidationError(errors)
    if (arguments.length === 1) {
      data = { errors: arg1 };
    }
    // construct with message and errors: ValidationError(message, errors)
    if (arguments.length === 2) {
      message = arg1;
      data = { errors: arg2 };
    }
    super(message, 'ValidationError', 422, 'validation-error', data);
  }

  static get errorCodes() {
    return errorCodes;
  }

  static createValidationError(code, message, field, resource = '') {
    return {
      code,
      message,
      field,
      resource,
    }
  }

}

module.exports = ValidationError;
