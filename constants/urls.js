/**
 * Created on 31-May-18.
 */

const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://api.hunchdown.com' : 'http://localhost:4000/api';

const HUNCHES_URL = `${BASE_URL}/hunches`;
const BOXES_URL = `${BASE_URL}/boxes`;

module.exports = {
  BASE_URL,
  HUNCHES_URL,
  BOXES_URL
};