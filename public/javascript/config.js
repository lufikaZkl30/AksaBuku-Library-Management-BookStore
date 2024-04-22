const { name } = require("ejs");
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Login");

//check database connected or not 
connect.then(() =>{
    console.log("Database connected");
})
.catch(()=>{
    console.log("Database cannot be connected")
})

//create a schema 
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//collection part
const collection =  new mongoose.model("users", LoginSchema);

module.exports = collection;