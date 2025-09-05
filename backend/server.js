const express=require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app=express();

app.use(express.json());


app.get("/",(req,res)=>{
    res.json({msg:"hii"})
})


mongoose.connect(process.env.DB_URI).then(()=>{
  console.log("✅ MongoDB connected");
  
app.listen(process.env.PORT || 5000,()=>{
  console.log(`server running on port http://localhost:${process.env.PORT}`);
});

}).catch((err)=>{
   console.error("❌ MongoDB connection error:", err);
})
