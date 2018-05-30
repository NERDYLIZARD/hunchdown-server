/**
 * Created on 29-May-18.
 */
const router = require('express').Router();
const mongoose = require('mongoose');
const errors = require('@feathersjs/errors');
const { getFullUrl, getPaginationUrl } = require('../../utils/url');

const Box = mongoose.model('Box');


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


module.exports = router;