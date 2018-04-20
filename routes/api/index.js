/**
 * Created on 20-Apr-18.
 */
const router = require('express').Router();
const MongoError = require('mongoose').Error;

// API Routes
router.use('/cards', require('./cards'));

router.use(function (err, req, res, next) {

//// Ideal Validation Error Format
  // {
  //   code:
  //   message:
  //   errors: [
  //     {
  //       code:
  //       message:
  //       resource:
  //       field:
  //     }
  //   ]
  // }

  // handle MongoDB validation errors
  if (err.name === 'ValidationError' && err instanceof MongoError) {
    return res.status(422).json({
      code: err.name,
      message: err.message,
      errors: Object.keys(err.errors).reduce((errors, key) => {

        // create each error according to a key
        const error = {
          code: err.errors[key].type,
          message: err.errors[key].message,
          // resource: find out how to get the model that throws the error
          field: key,
        };
        // push the error into an errors array
        errors.push(error);

        return errors;
      }, [])
    });
  }

  return next(err);
});

module.exports = router;