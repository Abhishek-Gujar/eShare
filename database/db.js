require("dotenv").config();
const mongoose = require("mongoose");

function connectDB(){
    mongoose.connect(process.env.mongo_connection_url,{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});
    const connection = mongoose.connection;

    connection.once('open',()=>{
        console.log("DataBase connected");
    }).catch(err=>{
        console.log("connection failed");
    });
}

module.exports = connectDB;