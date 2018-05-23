/**
 * Created on 28-Apr-18.
 */
const DataFactory = require('./DataFactory');

class ValidationErrorDataFactory extends DataFactory {
  constructor() {
    const validationError = {
      code: null,
      message: null,
      field: null,
      resource: null,
    };
    super(validationError);
    this.validationError = validationError;
  }

  getObjectProps() {
    return Object.keys(this.validationError).reduce((props, key) => {
      props.push(key);
      return props;
    }, []);
  }

}

module.exports = ValidationErrorDataFactory;
