const express=require('express');
const path=require("path");

const app=express();

app.use(express.static(path.join(__dirname,"./public")));

app.listen(3000,(err)=>{
    if(err) console.error("Error in the server:",err);

    console.log("server is listening!");
})