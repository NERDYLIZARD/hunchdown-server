/**
 * Created on 24-Apr-18.
 */
const url = require('url');

/**
 *
 * @param req
 * @returns string fullUrl
 */
// example output: "http://localhost:4000/api/hunches"
function getFullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  });
}

// example output: "<http://localhost:4000/api/hunches?page=1&perPage=10>; rel="first">,
                // <http://localhost:4000/api/hunches?page=3&perPage=10>; rel="prev">"
                // <http://localhost:4000/api/hunches?page=4&perPage=10>; rel="next">"
                // <http://localhost:4000/api/hunches?page=9&perPage=10>; rel="last">"
function getPaginationUrl(req, page, perPage, totalPages) {
  const fullUrl = getFullUrl(req);
  const prevUrl = page === 1 ? null : fullUrl + `?page=${page - 1}&perPage=${perPage}`;
  const nextUrl = page === totalPages ? null : fullUrl + `?page=${page + 1}&perPage=${perPage}`;
  const firstUrl = fullUrl + `?page=1&perPage=${perPage}`;
  const lastUrl = fullUrl + `?page=${totalPages}&perPage=${perPage}`;

  let paginationUrl = '';
  paginationUrl += `<${firstUrl}>; rel="first">,`;
  paginationUrl += nextUrl ? `<${nextUrl}>; rel="next">,` : '';
  paginationUrl += prevUrl ? `<${prevUrl}>; rel="prev">,` : '';
  paginationUrl += `<${lastUrl}>; rel="last">`;

  return paginationUrl;
}

module.exports = { getFullUrl, getPaginationUrl };
