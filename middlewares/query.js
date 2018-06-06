/**
 * Created on 05-Jun-18.
 */
/**
 * Middleware extracts a query string "?embed=resource1.field1,resource2.field1" and return the array [{ resource: String, fields: String[] }]
 * @sampleInput req.query.embeds = "boxes.title,boxes.description,users.email"
 * @sampleOutput req.embeds = [{ resource: "boxes", fields: "title description" }, { resource: "users", fields: "email" }]
 * @param req
 * @param res
 * @param next
 */
module.exports.embeds = function (req, res, next) {

  if (!req.query.embeds)
    return next();

  const embedsQuery = req.query.embeds.split(',');

  const embeds = embedsQuery.reduce((accumulator, query) => {
    const resource = query.split('.')[0];
    const field = query.split('.')[1];
    if (!accumulator[resource])
      accumulator[resource] = [];
    accumulator[resource].push(field);
    return accumulator;
  }, {});

  req.embeds = Object.keys(embeds).reduce((accumulator, key) => {
    accumulator.push({
      resource: key,
      fields: embeds[key].join(' ')
    });
    return accumulator;
  }, []);

  next();
};

/**
 * Middleware extracts a query string "?fields=field1,field2" and turn it into string "field1 field2".
 * @sampleInput req.query.fields = "wisdom,attribute"
 * @sampleOutput req.fields = "wisdom attribute"
 * @param req
 * @param res
 * @param next
 */
module.exports.fields = function (req, res, next) {
  if (!req.query.fields)
    return next();

  req.fields = req.query.fields.replace(new RegExp(',', 'g'), ' ');

  next();
};