const express = require('express');
const router = express.Router();
const robotController = require('../controllers/robotController');

router.get('/alive', robotController.checkAlive);

module.exports = router; 