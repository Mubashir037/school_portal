const express = require('express');
const router = express.Router();
const multer = require('multer');
const middleware = require('../middleware/auth');
const { previewImport, confirmImport } = require('../controllers/importController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/preview', middleware, upload.single('file'), previewImport);
router.post('/confirm', middleware, confirmImport);

module.exports = router;