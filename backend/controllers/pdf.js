const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const Student = require('../models/Student');
const LeavingCertificate = require('../models/Leavingcertificate');

const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '—');

const row = (label, value) => `
  <div class="row">
    <span><b>${label}:</b> ${value || '—'}</span>
  </div>`;

const generateCertificatePdf = async (req, res) => {
  try {
    const { grno } = req.params;
    const student = await Student.findOne({ grno });
    const cert = await LeavingCertificate.findOne({ grno });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (!cert) return res.status(404).json({ message: 'No leaving certificate issued for this GR No' });

    let logoBase64 = '';
    try {
      const logoPath = path.join(__dirname, '../assets/logo.png');
      logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
    } catch (e) { /* no logo, skip */ }

    const html = `
    <html><head><style>
      body { font-family: Helvetica, Arial, sans-serif; margin: 0; color: #1B2333; }
      .header { background: #16223A; color: #fff; padding: 18px 40px; display: flex; align-items: center; gap: 16px; }
      .header img { width: 50px; height: 50px; border-radius: 50%; }
      .header h1 { font-size: 20px; margin: 0; flex: 1; text-align: center; }
      .header p { font-size: 12px; margin: 4px 0 0; text-align: center; }
      .title { text-align: center; font-size: 17px; font-weight: bold; text-decoration: underline; margin: 30px 0; }
      .fields { padding: 0 45px; font-size: 13px; }
      .row { border-bottom: 1px solid #999; padding: 8px 0 4px; }
      .footer { padding: 0 45px; font-size: 10px; color: #555; margin-top: 40px; }
      .sign { display: flex; justify-content: space-between; padding: 0 45px; margin-top: 60px; font-size: 11px; }
    </style></head>
    <body>
      <div class="header">
        ${logoBase64 ? `<img src="${logoBase64}" />` : ''}
        <div style="flex:1">
          <h1>AQSA PUBLIC HIGHER SECONDARY SCHOOL</h1>
          <p>TANDO ALLAHYAR</p>
        </div>
      </div>
      <div class="title">SCHOOL LEAVING CERTIFICATE</div>
      <div class="fields">
        ${row('G.R. No.', student.grno)}
        ${row('Name of Pupil', `${student.first_name} ${student.last_name || ''}`)}
        ${row("Father's Name", student.father_name)}
        ${row('Religion', student.religion)}
        ${row('Race &amp; Cast', student.cast)}
        ${row('Date of Birth', fmt(student.dob))}
        ${row('Place of Birth', student.place_of_birth)}
        ${row('Last School Attended', student.last_school_attended)}
        ${row('Date of Admission', fmt(student.date_of_admission))}
        ${row('Class at Admission', student.class_at_admission)}
        ${row('Progress', cert.progress)}
        ${row('Conduct', student.conduct)}
        ${row('Date of Leaving', fmt(cert.date_of_leaving))}
        ${row('Class at Leaving', cert.class_at_leaving)}
        ${row('Reason', cert.reason_for_leaving)}
        ${row('Remarks', cert.remarks)}
      </div>
      <div class="footer">Certified that the above information is in accordance with the school General Register.</div>
      <div class="sign">
        <div>_____________________<br/>G.R. Incharge</div>
        <div>_____________________<br/>Principal<br/>AQSA PUBLIC HIGHER SEC. SCHOOL, Tando Allahyar</div>
      </div>
    </body></html>`;

   // const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
   const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless
});
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=LeavingCertificate_${grno}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { generateCertificatePdf };