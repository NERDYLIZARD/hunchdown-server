/**
 * Created on 20-Apr-18.
 */
const router = require('express').Router();
const _ = require('lodash');
const mongoose = require('mongoose');
const errors = require('@feathersjs/errors');
const { getPaginationUrl } = require('../../utils/url');
const urls = require('../../constants/urls');
const query = require('../../middlewares/query');

const Hunch = mongoose.model('Hunch');
const Box = mongoose.model('Box');


router.get('/', query.fields, query.embeds, async (req, res) => {

  const perPage = req.query.perPage ? req.query.perPage : 12;
  const page = req.query.page ? req.query.page : 1;

  // find hunches with pagination
  let findHunches = Hunch.find()
    .limit(Number(perPage))
    .skip(Number(perPage * (page - 1)));

  // select only the sparse fields
  if (req.fields) {
    findHunches = findHunches.select(req.fields);
  }

  // populate embedded resources and their fields
  if (req.embeds) {
    req.embeds.forEach(embed => {
      findHunches = findHunches.populate({
        path: embed.resource,
        select: embed.fields
      });
    });
  }

  const getTotalHunches = Hunch.count();

  const [hunches, totalHunches] = await Promise.all([findHunches.exec(), getTotalHunches.exec()]);

  const totalPages = Math.ceil(totalHunches / perPage);

  // pagination link
  const paginationUrl = getPaginationUrl(req, page, perPage, totalPages);

  res.set('Link', paginationUrl);
  res.set('X-Current-Page', page);
  res.set('X-Total-Pages', totalPages);
  res.status(200).json(hunches);
});

router.get('/:hunch', query.fields, query.embeds, async (req, res) => {
  const id = req.params.hunch;

  let findHunch = Hunch.findById(id);

  // select only the sparse fields
  if (req.fields) {
    findHunch = findHunch.select(req.fields);
  }

  // populate embedded resources and their fields
  if (req.embeds) {
    req.embeds.forEach(embed => {
      findHunch = findHunch.populate({
        path: embed.resource,
        select: embed.fields
      });
    });
  }
  const hunch = await findHunch.exec();

  if (!hunch) throw new errors.NotFound('The hunch is not found.');

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
    hunch.boxes.push(box);
    box.hunches.push(hunch);
    await box.save();
  }

  hunch = await hunch.save();

  const location = `${urls.HUNCHES_URL}/${hunch._id}`;

  res.set('Location', location);
  res.status(201).json(hunch);
});


router.patch('/:hunch', async (req, res) => {

  const { wisdom, attribute } = req.body;
  const id = req.params.hunch;

  let hunch = await Hunch.findById(id);

  if (!hunch) throw new errors.NotFound('The hunch is not found.');

  if (typeof wisdom !== 'undefined') {
    hunch.wisdom = wisdom;
  }

  if (typeof attribute !== 'undefined') {
    hunch.attribute = attribute;
  }

  if (typeof req.body.boxes !== 'undefined') {

    const boxes = await Box.find({ hunches: hunch });

    // `id` returns stringified value of `_id`
    const currentBoxIds = boxes.map(box => box.id);
    const newBoxIds = req.body.boxes;

    const removingBoxIds = _.difference(currentBoxIds, newBoxIds);
    const insertingBoxIds = _.difference(newBoxIds, currentBoxIds);

    const [removingBoxes, insertingBoxes] = await Promise.all([
      Box.find({ _id: { $in: removingBoxIds } }),
      Box.find({ _id: { $in: insertingBoxIds } })
    ]);

    // TODO: modularize many-many relationship both add(push) and remove(pull) e.g. function many(hunch, boxes) { ... }
    // many-many relationship
    const saveBoxes = [];
    if (removingBoxes) {
      removingBoxes.forEach(removingBox => {
        hunch.boxes.pull(removingBox);
        removingBox.hunches.pull(hunch);
        saveBoxes.push(removingBox.save());
      });
    }
    if (insertingBoxes) {
      insertingBoxes.forEach(insertingBox => {
        hunch.boxes.push(insertingBox);
        insertingBox.hunches.push(hunch);
        saveBoxes.push(insertingBox.save());
      })
    }
    await Promise.all(saveBoxes);
  }

  hunch = await hunch.save();
  res.status(200).json(hunch);
});


router.delete('/:hunch', async (req, res) => {
  const id = req.params.hunch;
  const hunch = await Hunch.findById(id);

  if (!hunch) throw new errors.NotFound('The hunch is not found.');

  await hunch.remove();
  res.sendStatus(204);
});


router.get('/:hunch/boxes', async (req, res) => {
  const hunchId = req.params.hunch;
  const boxes = await Box.find({ hunches: hunchId });

  if (!boxes.length)
    throw new errors.NotFound('The boxes are not found.');

  res.status(200).json(boxes);
});


module.exports = router;