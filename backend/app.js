const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const adminroutes = require('./routes/AdminRoute');
const studentroutes = require('./routes/studentroutes');
const importRoutes = require('./routes/importRoute');
const leavingCertificateRoute = require('./routes/leavingcertificate');
const resultCardRoute = require('./routes/resultcard');
const feeRoute = require('./routes/feeRoute');
const analyticsRoute = require('./routes/analyticsroute');
dotenv.config();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  console.log('→', req.method, req.url);
  next();
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));
app.use('/api/certificate', leavingCertificateRoute);
app.use('/api/admin', adminroutes);
app.use('/api/student', studentroutes);
app.use('/api/student/import', importRoutes);
app.use('/api/resultcard', resultCardRoute);
app.use('/api/fee', feeRoute);
app.use('/api/analytics', analyticsRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server is being hit');
});