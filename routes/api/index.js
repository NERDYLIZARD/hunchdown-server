/**
 * Created on 20-Apr-18.
 */
const router = require('express').Router();

// API Routes
router.use('/cards', require('./cards'));

module.exports = router;