/**
 * Created on 20-Apr-18.
 */
const router = require('express').Router();
const mongoose = require('mongoose');
const ValidationError = require('../../utils/ValidationError');

const Card = mongoose.model('Card');

// test validation error
router.get('/validation', (req, res, next) => {
  next(new ValidationError('Validation Error Message', [
    ValidationError.createValidationError(
      ValidationError.errorCodes.INVALID,
      'invalid wisdom',
      'wisdom',
      'cards',
    )
  ]));
});

// test mongoose validation error
router.post('/', async (req, res) => {
  const card = new Card({
    // validation error: wisdom is required
    wisdom: '',
    attribute: 'defg',
  });
  await card.save();
  res.status(201).json(card);

});

router.get('/', async (req, res) => {
  const cards = await Card.find();
  res.status(200).json(cards);
});

module.exports = router;