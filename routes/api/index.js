/**
 * Created on 20-Apr-18.
 */
const router = require('express').Router();

/**
 * API Routes
 */
router.use('/boxes', require('./boxes'));
router.use('/hunches', require('./hunches'));


module.exports = router;