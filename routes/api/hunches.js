/**
 * Created on 20-Apr-18.
 */
const router = require('express').Router();
const mongoose = require('mongoose');
const errors = require('@feathersjs/errors');
const { getPaginationUrl } = require('../../utils/url');
const urls = require('../../constants/urls');

const Hunch = mongoose.model('Hunch');
const Box = mongoose.model('Box');


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
  const paginationUrl = getPaginationUrl(req, page, perPage, totalPages);

  res.set('Link', paginationUrl);
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
    attribute
  });
  const boxes = await Box.find({ _id: { $in: req.body.boxes } });

  // many-many relationship
  for (let box of boxes) {
    box.hunches.push(hunch);
    await box.save();
  }
  for (let box of boxes) {
    hunch.boxes.push(box);
  }

  hunch = await hunch.save();

  const location = `${urls.HUNCHES_URL}/${hunch._id}`;

  res.set('Location', location);
  res.status(201).json(hunch);
});


router.patch('/:hunch', async (req, res, next) => {

  const { wisdom, attribute } = req.body;
  const id = req.params.hunch;

  let hunch = await Hunch.findById(id);

  if (!hunch) return next(new errors.NotFound('The hunch is not found.'));

  if (typeof wisdom !== 'undefined')
    hunch.wisdom = wisdom;
  if (typeof attribute !== 'undefined')
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