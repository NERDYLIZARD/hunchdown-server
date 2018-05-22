/**
 * Created on 20-Apr-18.
 */
const router = require('express').Router();
const mongoose = require('mongoose');
const errors = require('@feathersjs/errors');
const { getFullUrl, getPaginationLink } = require('../../utils/url');

const Hunch = mongoose.model('Hunch');


router.get('/', async (req, res) => {

  const perPage = req.query.perPage ? req.query.perPage : 10;
  const page = req.query.page ? req.query.page : 1;

  // TODO: parallelize find() and count()
  const hunches = await Hunch.find()
    .limit(Number(perPage))
    .skip(Number(perPage * (page - 1)))
    .exec();

  const totalHunches = await Hunch.count();
  const totalPages = Math.ceil(totalHunches / perPage);

  // pagination link
  const paginationLink = getPaginationLink(req, page, perPage, totalPages);

  res.set('Link', paginationLink);
  res.set('X-Current-Page', page);
  res.set('X-Total-Pages', totalPages);
  res.status(200).json(hunches);
});

router.get('/:hunch', async (req, res, next) => {
  const id = req.params.hunch;
  const hunch = await Hunch.findById(id);

  if (!hunch) return next(new errors.NotFound('The hunch is not found.'));

  res.status(200).json(hunch);
});

router.post('/', async (req, res) => {
  const { wisdom, attribute } = req.body;

  let hunch = new Hunch({
    wisdom,
    attribute,
  });
  hunch = await hunch.save();

  const location = `${getFullUrl(req)}/${hunch._id}`;

  res.set('Location', location);
  res.status(201).json(hunch);
});


router.patch('/:hunch', async (req, res, next) => {

  const { wisdom, attribute } = req.body;
  const id = req.params.hunch;

  let hunch = await Hunch.findById(id);

  if (!hunch) return next(new errors.NotFound('The hunch is not found.'));

  hunch.wisdom = wisdom;
  hunch.attribute = attribute;
  hunch = await hunch.save();

  res.status(200).json(hunch);
});

router.delete('/:hunch', async (req, res, next) => {
  const id = req.params.hunch;
  const hunch = await Hunch.findById(id);

  if (!hunch) return next(new errors.NotFound('The hunch is not found.'));

  await hunch.remove();
  res.sendStatus(204);
});


module.exports = router;