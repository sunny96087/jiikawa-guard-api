const express = require('express');
const router = express.Router();
const robotController = require('../controllers/robotController');

router.get('/alive', robotController.checkAlive);

router.get('/alive-internal', robotController.checkAliveInternal);

module.exports = router; 