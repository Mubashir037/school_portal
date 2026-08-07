const XLSX = require('xlsx');
const Student = require('../models/Student');

// Maps your real Excel column headers -> your schema field names.
// If your actual Excel file uses different header text, this is the ONLY
// place you need to change it.
const HEADER_MAP = {
  'GR No': 'grno',
  'First Name': 'first_name',
  'Last Name': 'last_name',
  'Father Name': 'father_name',
  'Father Contact No': 'father_no',
  'Father CNIC': 'father_cnic',
  'Date of Birth': 'dob',
  'Class': 'class',
  'Cast': 'cast'
};

const CNIC_REGEX = /^\d{13}$/;
const PHONE_REGEX = /^\d{11}$/;

// Converts one raw Excel row (keyed by header text) into
// { data, skipReason, warnings } based on our agreed rules.
function processRow(rawRow, seenGrNos) {
  // 1. remap headers -> schema field names
  const row = {};
  for (const [excelHeader, value] of Object.entries(rawRow)) {
    const field = HEADER_MAP[excelHeader];
    if (field) row[field] = typeof value === 'string' ? value.trim() : value;
  }

  const warnings = [];

  // 2. required fields — missing any of these skips the whole row
  if (!row.grno) return { skipReason: 'Missing GR No' };
  if (!row.first_name) return { skipReason: `GR ${row.grno} — missing First Name` };
  if (!row.class) return { skipReason: `GR ${row.grno} — missing Class` };

  // 3. duplicate GR No within the same file
  if (seenGrNos.has(row.grno)) {
    return { skipReason: `GR ${row.grno} — duplicate GR No within the file` };
  }

  // 4. optional field format checks — blank + warn, don't skip the row
  if (row.father_cnic && !CNIC_REGEX.test(String(row.father_cnic))) {
    warnings.push(`GR ${row.grno} — Father CNIC invalid, left blank`);
    row.father_cnic = '';
  }

  if (row.father_no && !PHONE_REGEX.test(String(row.father_no))) {
    warnings.push(`GR ${row.grno} — Father contact number invalid, left blank`);
    row.father_no = '';
  }

  if (row.dob) {
    const dobDate = new Date(row.dob);
    if (isNaN(dobDate) || dobDate > new Date()) {
      warnings.push(`GR ${row.grno} — Date of birth invalid or in the future, left blank`);
      row.dob = null;
    } else {
      row.dob = dobDate;
    }
  }

  return { data: row, warnings };
}

// STEP A — parse + validate, save NOTHING yet
exports.previewImport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(sheet);

    if (rawRows.length === 0) {
      return res.status(400).json({ message: 'Excel file has no data rows' });
    }

    // existing GR Nos already in the database, for duplicate checking
    const existingGrNos = new Set((await Student.find({}, 'grno')).map((s) => s.grno));

    const validRows = [];
    const skipped = [];
    const warnings = [];
    const seenGrNos = new Set();

    rawRows.forEach((rawRow, index) => {
      const result = processRow(rawRow, seenGrNos);

      if (result.skipReason) {
        skipped.push({ rowNumber: index + 2, reason: result.skipReason }); // +2: row 1 is header, arrays are 0-indexed
        return;
      }

      // duplicate against what's already saved in the database
      if (existingGrNos.has(result.data.grno)) {
        skipped.push({
          rowNumber: index + 2,
          reason: `GR ${result.data.grno} — already exists in the database`
        });
        return;
      }

      seenGrNos.add(result.data.grno);
      validRows.push(result.data);
      if (result.warnings.length) warnings.push(...result.warnings);
    });

    res.json({
      totalRows: rawRows.length,
      validCount: validRows.length,
      skippedCount: skipped.length,
      validRows,
      skipped,
      warnings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to parse Excel file: ' + err.message });
  }
};

// STEP B — actually insert the rows the admin confirmed
exports.confirmImport = async (req, res) => {
  try {
    const { rows } = req.body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'No rows provided to import' });
    }

    // insertMany with ordered:false = keep inserting the rest even if one fails
    // (e.g. a GR No someone else added between preview and confirm)
    const result = await Student.insertMany(rows, { ordered: false });

    res.status(201).json({
      message: `${result.length} student(s) imported successfully`,
      insertedCount: result.length
    });
  } catch (err) {
    // insertMany throws even on PARTIAL success when ordered:false — check err.insertedDocs
    if (err.insertedDocs) {
      return res.status(207).json({
        message: `${err.insertedDocs.length} imported, some rows failed (likely duplicate GR No)`,
        insertedCount: err.insertedDocs.length,
        error: err.message
      });
    }
    console.error(err);
    res.status(500).json({ message: 'Import failed: ' + err.message });
  }
};