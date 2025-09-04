const express=require('express');
require('dotenv').config();

const app=express();

app.get("/",(req,res)=>{
    res.json({msg:"hii"})
})


app.listen(process.env.PORT || 5000,()=>{
  console.log(`server running on port http://localhost:${process.env.PORT}`);
})