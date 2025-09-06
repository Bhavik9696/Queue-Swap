const express=require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const helperRoutes = require('./routes/helpers');


const app=express();

app.use(express.json());

app.use(helmet());

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));


app.get("/",(req,res)=>{
    res.json({msg:"Queue-Swap"})
})


mongoose.connect(process.env.DB_URI).then(()=>{
  console.log("✅ MongoDB connected");
  
app.listen(process.env.PORT || 5000,()=>{
  console.log(`server running on port http://localhost:${process.env.PORT}`);
});

}).catch((err)=>{
   console.error("❌ MongoDB connection error:", err);
})
