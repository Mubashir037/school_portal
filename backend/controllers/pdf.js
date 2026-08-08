const PDFDocument = require('pdfkit');
const Student = require('../models/Student');
const LeavingCertificate = require('../models/Leavingcertificate');

const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '—');

const generateCertificatePdf = async (req, res) => {
  try {
    const { grno } = req.params;
    const student = await Student.findOne({ grno });
    const cert = await LeavingCertificate.findOne({ grno });

    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (!cert) return res.status(404).json({ message: 'No leaving certificate issued for this GR No' });

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=LeavingCertificate_${grno}.pdf`);
    doc.pipe(res);

    // header banner
    doc.rect(50, 50, 495, 60).fill('#16223A');
    doc.fillColor('#fff').fontSize(18).font('Helvetica-Bold')
      .text('AQSA PUBLIC HIGHER SECONDARY SCHOOL', 50, 65, { width: 495, align: 'center' });
    doc.fontSize(11).font('Helvetica').text('TANDO ALLAHYAR', 50, 90, { width: 495, align: 'center' });

    doc.moveDown(3);
    doc.fillColor('#1B2333').fontSize(15).font('Helvetica-Bold')
      .text('SCHOOL LEAVING CERTIFICATE', 50, 135, { width: 495, align: 'center', underline: true });

    // fields
    const rows = [
      ['G.R. No.', student.grno],
      ['Name of Pupil', `${student.first_name} ${student.last_name || ''}`],
      ["Father's Name", student.father_name],
      ['Religion', cert.religion],
      ['Race & Cast', student.cast],
      ['Date of Birth', fmt(student.dob)],
      ['Place of Birth', cert.place_of_birth],
      ['Last School Attended', cert.last_school_attended],
      ['Date of Admission', fmt(cert.date_of_admission)],
      ['Class at Admission', cert.class_at_admission],
      ['Progress', cert.progress],
      ['Conduct', cert.conduct],
      ['Date of Leaving', fmt(cert.date_of_leaving)],
      ['Class at Leaving', cert.class_at_leaving],
      ['Reason', cert.reason_for_leaving],
      ['Remarks', cert.remarks]
    ];

    let y = 175;
    doc.fontSize(11).font('Helvetica');
    rows.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(`${label}:`, 50, y, { continued: true, width: 180 });
      doc.font('Helvetica').text(`  ${value || '—'}`, { width: 300 });
      doc.moveTo(230, y + 14).lineTo(545, y + 14).strokeColor('#999').stroke();
      y += 28;
    });

    // footer
    y += 20;
    doc.fontSize(9).fillColor('#555')
      .text('Certified that the above information is in accordance with the school General Register.', 50, y, { width: 495 });

    y += 60;
    doc.fontSize(10).fillColor('#1B2333');
    doc.text('_____________________', 50, y);
    doc.text('G.R. Incharge', 50, y + 15);

    doc.text('_____________________', 350, y);
    doc.text('Principal', 350, y + 15);
    doc.fontSize(8).text('AQSA PUBLIC HIGHER SEC. SCHOOL, Tando Allahyar', 350, y + 28);

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { generateCertificatePdf };