/**
 * Created on 28-Apr-18.
 */

function getCardProps() {
  return ['_id', 'wisdom', 'attribute'];
}

function createCardObject() {
  return {
    wisdom: 'foo',
    attribute: 'bar',
  }
}

function createCardObjectWithInvalid(key, value) {
  const card = createCardObject();
  card[key] = value;
  return card;
}

function createCardObjectWithOut(prop) {
  const card = createCardObject();
  delete card[prop];
  return card;
}

module.exports = { getCardProps, createCardObject, createCardObjectWithOut, createCardObjectWithInvalid };