

const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');

const middleware = require('../middleware/auth');

// memory storage (no file saved on disk)
const upload = multer({
  storage: multer.memoryStorage()
});

// ============================
// POST /api/student/import/preview
// ============================
router.post(
  '/preview',
  
  upload.single('file'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // read excel from buffer
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // convert to JSON
      const data = XLSX.utils.sheet_to_json(sheet);

      console.log("Parsed Excel Data:", data);

      // 🔥 TEMP: just return raw data
      res.json({
        totalRows: data.length,
        preview: data.slice(0, 5) // first 5 rows
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error processing file' });
    }
  }
);

module.exports = router;