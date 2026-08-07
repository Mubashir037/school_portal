const express=require('express');
const app=express();
const mongoose = require('mongoose');
const cors = require('cors');
const adminroutes=require('./routes/AdminRoute')
const dotenv = require('dotenv');
dotenv.config();
app.use(express.json());
app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));
//admin
app.use('/api/admin',adminroutes);

app.listen(5000,()=>{
    console.log("server is being hit");
})