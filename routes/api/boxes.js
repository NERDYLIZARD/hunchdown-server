/**
 * Created on 29-May-18.
 */
const router = require('express').Router();
const mongoose = require('mongoose');
const errors = require('@feathersjs/errors');
const { getFullUrl, getPaginationUrl } = require('../../utils/url');

const Box = mongoose.model('Box');


router.get('/', async (req, res) => {

  const perPage = req.query.perPage ? req.query.perPage : 10;
  const page = req.query.page ? req.query.page : 1;

  // TODO: parallelize find() and count()
  const boxes = await Box.find()
    .limit(Number(perPage))
    .skip(Number(perPage * (page - 1)))
    .exec();

  const totalBoxes = await Box.count();
  const totalPages = Math.ceil(totalBoxes / perPage);

  const paginationUrl = getPaginationUrl(req, page, perPage, totalPages);

  res.set('Link', paginationUrl);
  res.set('X-Current-Page', page);
  res.set('X-Total-Pages', totalPages);
  res.status(200).json(boxes);
});


router.get('/:box', async (req, res, next) => {
  const id = req.params.box;
  const box = await Box.findById(id);

  if (!box) return next(new errors.NotFound('The box is not found.'));

  res.status(200).json(box);
});


router.post('/', async (req, res) => {
  const { title, description } = req.body;
  let box = new Box({
    title,
    description,
  });
  box = await box.save();

  const location = `${getFullUrl(req)}/${box._id}`;

  res.set('Location', location);
  res.status(201).json(box);
});


router.patch('/:box', async (req, res, next) => {

  const { title, description } = req.body;
  const id = req.params.box;

  let box = await Box.findById(id);

  if (!box) return next(new errors.NotFound('The box is not found.'));

  if (typeof title !== 'undefined')
    box.title = title;
  if (typeof description !== 'undefined')
    box.description = description;

  box = await box.save();

  res.status(200).json(box);
});


module.exports = router;