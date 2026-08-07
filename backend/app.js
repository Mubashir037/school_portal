const express=require('express');
const app=express();
const mongoose = require('mongoose');
const cors = require('cors');
const adminroutes=require('./routes/AdminRoute')
const dotenv = require('dotenv');
const studentroutes=require('./routes/studentroutes');
const helmet = require("helmet");
const importRoutes = require('./routes/importRoute');

//import
app.use('/api/student/import', importRoutes);
app.use(helmet());
dotenv.config();
app.use(express.json());
app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));
//admin
app.use('/api/admin',adminroutes);
//student crud
app.use('/api/student',studentroutes);
app.listen(5000,()=>{
    console.log("server is being hit");
})