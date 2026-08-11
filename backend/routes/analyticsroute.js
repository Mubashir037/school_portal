const express = require('express');
const router = express.Router();
const middleware = require('../middleware/auth');
const { getAnalytics } = require('../controllers/analyticscontroller');

router.get('/', middleware, getAnalytics);

module.exports = router;