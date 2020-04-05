const express = require('express');
const authController = require('../controllers/authController');
const artistController = require('./../controllers/artistController');

const router = express.Router();

router.get('/', artistController.getSeveralArtists);
router.get('/:id', artistController.getArtist);

module.exports = router;
