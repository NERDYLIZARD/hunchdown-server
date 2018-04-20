/**
 * Created on 20-Apr-18.
 */
const router = require('express').Router();
const mongoose = require('mongoose');

const Card = mongoose.model('Card');

router.get('/', async (req, res) => {
  const cards = await Card.find();
  res.status(200).json(cards);
});

module.exports = router;