const mongoose = require("mongoose");
require("dotenv").config();

exports.connect =()=>{
    mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("connection successfull with database"))
    .catch((error)=>{
        console.log("Issue in db connection");
        console.error(error);
        process.exit(1);
    });
}