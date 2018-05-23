/**
 * Created on 07-May-18.
 */

/**
 * A class of pure function that returns an object of sampleData
 */
class SampleData {

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
    object[prop] = undefined;
    return object;
  }

  /**
   * @returns {[string]} array of object's key with _id e.g. ["_id", "title", "description"]
   */
  getObjectProps() {
    return Object.keys(this.object).reduce((props, key) => {
      props.push(key);
      return props;
    }, ['_id']);
  }

}

module.exports = SampleData;
