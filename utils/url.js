/**
 * Created on 24-Apr-18.
 */
const url = require('url');

function getFullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  });
}

function getPaginationLink(req, page, perPage, totalPages) {
  const fullUrl = getFullUrl(req);
  const prevUrl = page === 1 ? null : fullUrl + `?page=${page - 1}&perPage=${perPage}`;
  const nextUrl = page === totalPages ? null : fullUrl + `?page=${page + 1}&perPage=${perPage}`;
  const firstUrl = fullUrl;
  const lastUrl = fullUrl + `?page=${totalPages}&perPage=${perPage}`;

  let paginationLink = '';
  paginationLink += `<${firstUrl}>; rel="first">,`;
  paginationLink += nextUrl ? `<${nextUrl}>; rel="next">,` : '';
  paginationLink += prevUrl ? `<${prevUrl}>; rel="prev">,` : '';
  paginationLink += `<${lastUrl}>; rel="last">`;

  return paginationLink;
}

module.exports.getFullUrl = getFullUrl;
module.exports.getPaginationLink = getPaginationLink;
