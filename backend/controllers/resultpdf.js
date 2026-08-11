const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const ResultCard = require('../models/resulltcard');
const Student = require('../models/Student');

const generateResultCardPdf = async (req, res) => {
  try {
    const card = await ResultCard.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Result card not found' });
    const student = await Student.findOne({ grno: card.grno });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    let logoBase64 = '';
    try {
      logoBase64 = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '../assets/logo.png')).toString('base64');
    } catch (e) {}

    const grade = card.percentage >= 90 ? 'A+' : card.percentage >= 80 ? 'A' : card.percentage >= 70 ? 'B' : card.percentage >= 60 ? 'C' : card.percentage >= 50 ? 'D' : 'F';

    const subjectRows = card.subjects.map(s => `
      <tr>
        <td>${s.subject}</td>
        <td class="c">${s.totalMarks}</td>
        <td class="c">${s.obtainedMarks}</td>
        <td class="c">${((s.obtainedMarks / s.totalMarks) * 100).toFixed(0)}%</td>
      </tr>`).join('');

    const html = `
    <html><head><style>
      body { font-family: 'Helvetica', Arial, sans-serif; margin: 0; color: #1a1a2e; }
      .top { background: linear-gradient(135deg,#1B2333,#2d3a56); color:#fff; padding: 30px 45px; display:flex; align-items:center; gap:18px; }
      .top img { width:54px; height:54px; border-radius:50%; }
      .top h1 { font-size:20px; margin:0; }
      .top p { font-size:12px; margin:3px 0 0; opacity:.8; }
      .badge { margin-left:auto; background:#B8873D; padding:6px 16px; border-radius:20px; font-size:12px; font-weight:bold; }
      .info { display:flex; justify-content:space-between; padding:24px 45px 0; font-size:13px; }
      .info div span { color:#888; display:block; font-size:10px; text-transform:uppercase; letter-spacing:.05em; }
      table { width:calc(100% - 90px); margin:24px 45px; border-collapse:collapse; font-size:13px; }
      th { background:#F2F0EF; text-align:left; padding:10px 12px; font-size:11px; text-transform:uppercase; letter-spacing:.05em; color:#666; }
      td { padding:10px 12px; border-bottom:1px solid #eee; }
      .c { text-align:center; }
      .summary { display:flex; gap:16px; margin:0 45px 24px; }
      .summary .box { flex:1; background:#F8F7F5; border-radius:10px; padding:16px; text-align:center; }
      .summary .box .val { font-size:22px; font-weight:bold; color:#1B2333; }
      .summary .box .lbl { font-size:10px; color:#888; text-transform:uppercase; letter-spacing:.05em; }
      .remarks { margin:0 45px 40px; font-size:12px; color:#555; }
      .sign { display:flex; justify-content:space-between; padding:0 45px; font-size:11px; margin-top:40px; }
    </style></head>
    <body>
      <div class="top">
        ${logoBase64 ? `<img src="${logoBase64}"/>` : ''}
        <div><h1>AQSA PUBLIC HIGHER SECONDARY SCHOOL</h1><p>TANDO ALLAHYAR</p></div>
        <div class="badge">RESULT CARD</div>
      </div>
      <div class="info">
        <div><span>Name</span>${student.first_name} ${student.last_name || ''}</div>
        <div><span>GR No</span>${student.grno}</div>
        <div><span>Class</span>${card.class}</div>
        <div><span>Session</span>${card.session}</div>
        <div><span>Term</span>${card.term}</div>
      </div>
      <table>
        <tr><th>Subject</th><th class="c">Total</th><th class="c">Obtained</th><th class="c">%</th></tr>
        ${subjectRows}
      </table>
      <div class="summary">
        <div class="box"><div class="val">${card.obtainedMarks}/${card.totalMarks}</div><div class="lbl">Marks</div></div>
        <div class="box"><div class="val">${card.percentage}%</div><div class="lbl">Percentage</div></div>
        <div class="box"><div class="val">${card.grade || grade}</div><div class="lbl">Grade</div></div>
      </div>
      ${card.remarks ? `<div class="remarks"><b>Remarks:</b> ${card.remarks}</div>` : ''}
      <div class="sign">
        <div>_____________________<br/>Class Teacher</div>
        <div>_____________________<br/>Principal</div>
      </div>
    </body></html>`;

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=ResultCard_${student.grno}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { generateResultCardPdf };