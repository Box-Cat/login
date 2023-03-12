const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Mongo DB Connection Successful")
})

db.on('error',(err)=>{
    console.log("Mongo DB Connection Failed")
})

module.exports = db;