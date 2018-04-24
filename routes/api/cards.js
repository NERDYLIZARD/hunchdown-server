/**
 * Created on 20-Apr-18.
 */
const router = require('express').Router();
const mongoose = require('mongoose');
const ValidationError = require('../../utils/ValidationError');
const { getPaginationLink } = require('../../utils/url');

const Card = mongoose.model('Card');

router.get('/', async (req, res) => {

  const perPage = req.query.perPage ? req.query.perPage : 10;
  const page = req.query.page ? req.query.page : 1;

  // TODO: parallelize find() and count()
  const cards = await Card.find()
    .limit(Number(perPage))
    .skip(Number(perPage * (page - 1)))
    .exec();

  const totalCards = await Card.count();
  const totalPages = Math.ceil(totalCards / perPage);

  // pagination link
  const paginationLink = getPaginationLink(req, page, perPage, totalPages);

  res.set('Link', paginationLink);
  res.set('X-Current-Page', page);
  res.set('X-Total-Pages', totalPages);
  res.status(200).json(cards);
});

module.exports = router;