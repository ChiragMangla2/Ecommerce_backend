const mongoose = require('mongoose');
require("dotenv").config();

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("DB Connected Successfully");
})
.catch((err)=>{
    console.log("DB Not Connected ", err);
})
