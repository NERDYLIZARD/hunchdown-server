/**
 * Created on 22-May-18.
 */
const omitArticles = (string) => {
  return string.replace(new RegExp('\\s(a|an|the)\\s', 'gi'), ' ');
};

module.exports = omitArticles;
