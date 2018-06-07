/**
 * Created on 29-May-18.
 */
const router = require('express').Router();
const mongoose = require('mongoose');
const errors = require('@feathersjs/errors');
const { getFullUrl, getPaginationUrl } = require('../../utils/url');
const query = require('../../middlewares/query');


const Box = mongoose.model('Box');
const Hunch = mongoose.model('Hunch');


router.get('/', query.fields, query.embeds, async (req, res) => {

  const perPage = req.query.perPage ? req.query.perPage : 12;
  const page = req.query.page ? req.query.page : 1;

  // find hunches with pagination
  let findBoxes = Box.find()
    .limit(Number(perPage))
    .skip(Number(perPage * (page - 1)));

  // select only the sparse fields
  if (req.fields) {
    findBoxes = findBoxes.select(req.fields);
  }

  // populate embedded resources and their fields
  if (req.embeds) {
    req.embeds.forEach(embed => {
      findBoxes = findBoxes.populate({
        path: embed.resource,
        select: embed.fields
      });
    });
  }

  const getTotalBoxes = Box.count();

  const [boxes, totalBoxes] = await Promise.all([findBoxes.exec(), getTotalBoxes.exec()]);

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



router.get('/:box/hunches', async (req, res) => {
  const boxId = req.params.box;
  const hunches = await Hunch.find({ boxes: boxId });

  if (!hunches.length)
    throw new errors.NotFound('The hunches are not found.');

  res.status(200).json(hunches);
});


module.exports = router;