/**
 * Created on 29-May-18.
 */
const router = require('express').Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const {NotFound} = require('../../libs/errors');
const {getFullUrl, getPaginationUrl} = require('../../utils/url');
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


router.get('/:boxId', query.fields, query.embeds, async (req, res) => {
  const id = req.params.boxId;

  let findBox = Box.findById(id);

  // select only the sparse fields
  if (req.fields) {
    findBox = findBox.select(req.fields);
  }

  // populate embedded resources and their fields
  if (req.embeds) {
    req.embeds.forEach(embed => {
      findBox = findBox.populate({
        path: embed.resource,
        select: embed.fields
      });
    });
  }
  const box = await findBox.exec();

  if (!box) throw new NotFound('boxNotFound');

  res.status(200).json(box);
});


router.post('/', async (req, res) => {

  req.checkBody('title').notEmpty().withMessage('missingTitle');
  const validationErrors = req.validationErrors();
  if (validationErrors) throw validationErrors;

  const {title, description} = req.body;
  let box = new Box({
    title,
    description,
  });
  box = await box.save();

  const location = `${getFullUrl(req)}/${box._id}`;

  res.set('Location', location);
  res.status(201).json(box);
});


router.patch('/:boxId', async (req, res) => {
  const {title, description} = req.body;
  const id = req.params.boxId;

  let box = await Box.findById(id);

  if (!box) throw new NotFound('boxNotFound');

  if (typeof title !== 'undefined')
    box.title = title;
  if (typeof description !== 'undefined')
    box.description = description;

  box = await box.save();

  res.status(200).json(box);
});


router.get('/:boxId/hunches', async (req, res) => {
  const boxId = req.params.boxId;

  const box = await Box.findById(boxId);
  if (!box) throw new NotFound('boxNotFound');

  const hunches = await Hunch.find({boxes: boxId});

  res.status(200).json(hunches);
});


/**
 * Add hunches into the box.
 * input string[] req.body.hunches (array of hunch's ids)
 */
router.post('/:boxId/hunches', async (req, res) => {
  const boxId = req.params.boxId;
  let box = await Box.findById(boxId);
  if (!box) throw new NotFound('boxNotFound');

  const hunchIds = req.body.hunches;

  const inputHunches = await Hunch.find({_id: {$in: hunchIds}});

  // add only hunches that are not already in the box
  const insertingHunches = [];
  inputHunches.forEach(hunch => {
    const hunchIsAlreadyInBox = _.some(hunch.boxes, box._id);
    if (!hunchIsAlreadyInBox) {
      insertingHunches.push(hunch);
    }
  });

  const saveHunches = [];
  insertingHunches.forEach(hunch => {
    hunch.boxes.push(box);
    box.hunches.push(hunch);
    saveHunches.push(hunch.save());
  });

  await Promise.all(saveHunches);
  box = await box.save();

  // return only the hunches that just have been inserted
  box.hunches = insertingHunches;
  res.status(200).json(box);
});


router.delete('/:boxId', async (req, res) => {
  const id = req.params.boxId;
  const box = await Box.findById(id);

  if (!box) throw new NotFound('boxNotFound');

  await box.remove();
  res.sendStatus(204);
});


module.exports = router;