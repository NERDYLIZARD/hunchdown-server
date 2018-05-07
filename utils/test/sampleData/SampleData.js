/**
 * Created on 07-May-18.
 */

/* class of pure function that return an object of sample sampleData */
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
    delete object[prop];
    return object;
  }

  // return array of object's key with _id e.g.
    // ["_id", "title", "description"]
  getObjectProps() {
    return Object.keys(this.object).reduce((props, key) => props.concat(key), ['_id']);
  }

}

module.exports = SampleData;
