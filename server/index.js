require("dotenv").config()
const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const cookieParser = require("cookie-parser");
const router= require('./router/index');
const cloudRouter=require('./router/cloud-router');
const errorMiddleware=require("./middleware/error-midleware");
const fileUpload = require("express-fileupload");
const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));
app.use('/api',router);
app.use('/cloud',cloudRouter);
app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"));
});
app.use(errorMiddleware);
// app.use(cors({
//     credentials:true,
//     origin:"http://localhost:3000"
// }));


mongoose.connect(process.env.DB_URL,{useNewUrlParser:true,useUnifiedTopology:true});
app.listen(5000,()=>{console.log(`Our server at http://localhost:5000/`)})