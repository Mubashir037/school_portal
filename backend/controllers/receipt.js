const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const Fee = require('../models/Fee');
const Student = require('../models/Student');

const generateReceipt = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee || fee.status !== 'Paid') return res.status(404).json({ message: 'Paid fee record not found' });
    const student = await Student.findOne({ grno: fee.grno });

    const html = `
    <html><head><style>
      body{font-family:'Courier New',monospace;width:280px;margin:0;padding:16px;font-size:12px;color:#111;}
      .c{text-align:center}
      hr{border:none;border-top:1px dashed #999;margin:8px 0}
      .row{display:flex;justify-content:space-between}
      .b{font-weight:bold}
    </style></head><body>
      <div class="c b">AQSA PUBLIC HIGHER SEC. SCHOOL</div>
      <div class="c">TANDO ALLAHYAR</div>
      <hr/>
      <div class="row"><span>Receipt#</span><span>${fee.receiptNo}</span></div>
      <div class="row"><span>Date</span><span>${new Date(fee.paidOn).toLocaleDateString('en-GB')}</span></div>
      <hr/>
      <div>Student: ${student.first_name} ${student.last_name || ''}</div>
      <div>GR No: ${fee.grno} &nbsp; Class: ${fee.class}</div>
      <hr/>
      <div class="row"><span>Fee (${fee.month})</span><span>Rs ${fee.amount}</span></div>
      <hr/>
      <div class="row b"><span>TOTAL PAID</span><span>Rs ${fee.amount}</span></div>
      <hr/>
      <div class="c">Thank you!</div>
    </body></html>`;

    //const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless
});
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ width: '80mm', height: '150mm', printBackground: true });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=Receipt_${fee.receiptNo}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { generateReceipt };