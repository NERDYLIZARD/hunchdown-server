/**
 * Created on 07-May-18.
 */

/**
 * A class of pure function that returns an object of data-factories
 */
class DataFactory {

  constructor(object) {
    this.object = { ...object };
  }

  createObject() {
    return this.object;
  }

  createObjectWithInvalid(key, value) {
    return { ...this.object, [key]: value };
  }

  createObjectWithOut(prop) {
    const object = { ...this.object };
    switch (typeof object[prop]) {
      case 'string':
        object[prop] = '';
        break;
      case 'object':
      case 'boolean':
        object[prop] = {};
        break;
      default:
        object[prop] = undefined;
    }
    return object;
  }

  /**
   * @returns {[string]} array of object's key with _id e.g. ["_id", "title", "description"]
   */
  getObjectProps() {
    return Object.keys(this.object).reduce((props, key) => {
      props.push(key);
      return props;
    }, ['id']);
  }

}

module.exports = DataFactory;
