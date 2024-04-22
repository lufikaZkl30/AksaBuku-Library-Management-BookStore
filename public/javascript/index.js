const express = require('express');
const pasth = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config")

const app = express();
//convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended:false}));

//use EJS as the view engine
app.set('view engine','ejs');
//static file
app.use(express.static("public"));

app.get("/", (req, res) =>{
    res.render("login");
})

app.get("/signup", (req, res) =>{
    res.render("signup");
})

//register users
app.post("/signup", async (req,res)=>{

    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    //check if the user already exist in the database
    const exsitingUser = await collection.findOne({name:data.name});
    if(exsitingUser){
        res.send("Akun sudah tersedia, Silahkan pilih nama lain,");
    }else{
        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

    //const userdata = await collection.insertMany(data);
    //console.log(userdata);
});

const port = 8090;
app.listen(port,() =>{
    console.log(`Server running on Port: ${port}`);
})