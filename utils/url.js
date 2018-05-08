/**
 * Created on 24-Apr-18.
 */
const url = require('url');

/**
 *
 * @param req
 * @returns string fullUrl
 */
// example output: "http://localhost:4000/api/cards"
function getFullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  });
}

// example output: "<http://localhost:4000/api/cards?page=1&perPage=10>; rel="first">,
                // <http://localhost:4000/api/cards?page=1&perPage=10>; rel="last">"
function getPaginationLink(req, page, perPage, totalPages) {
  const fullUrl = getFullUrl(req);
  const prevUrl = page === 1 ? null : fullUrl + `?page=${page - 1}&perPage=${perPage}`;
  const nextUrl = page === totalPages ? null : fullUrl + `?page=${page + 1}&perPage=${perPage}`;
  const firstUrl = fullUrl + `?page=1&perPage=${perPage}`;
  const lastUrl = fullUrl + `?page=${totalPages}&perPage=${perPage}`;

  let paginationLink = '';
  paginationLink += `<${firstUrl}>; rel="first">,`;
  paginationLink += nextUrl ? `<${nextUrl}>; rel="next">,` : '';
  paginationLink += prevUrl ? `<${prevUrl}>; rel="prev">,` : '';
  paginationLink += `<${lastUrl}>; rel="last">`;

  return paginationLink;
}

module.exports = { getFullUrl, getPaginationLink };
