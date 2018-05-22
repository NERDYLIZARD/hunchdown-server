/**
 * Created on 20-Apr-18.
 */
const router = require('express').Router();
const MongooseError = require('mongoose').Error;
const ValidationError = require('../../utils/ValidationError');


/**
 * API Routes
 */
router.use('/hunches', require('./hunches'));


/**
 * ValidationError handler
 */
/**
 * Validation Error Format:
 * {
 *  code:
 *  message:
 *  errors: [
 *    {
 *      code:
 *      message:
 *      field:
 *      resource:
 *    }
 *  ]
 * }
 */

router.use((err, req, res, next) => {

  // handle MongoDB validation errors
  if (err.name === 'ValidationError' && err instanceof MongooseError) {
    return res.status(err.status || 422).json({
      code: err.name,
      message: err.message,
      errors: Object.keys(err.errors).reduce((errors, key) => {

        // create each error according to a key
        const error = ValidationError.createValidationError(
          // TODO: mapping err.name to errorCode in ValidationError class e.g. alreadyExist, missingField, etc.
          err.errors[key].kind, // code
          err.errors[key].message, // message
          err.errors[key].path, // field
        );
        // push the error into an errors array
        errors.push(error);

        return errors;
      }, [])
    });
  }

  // handle custom ValidationError
  if (err.name === 'ValidationError') {
    return res.status(err.code || 422).json({
      code: err.name,
      message: err.message,
      errors: err.errors,
    });
  }

  return next(err);
});

module.exports = router;