const dotenv   = require("dotenv");
const mongoose = require("mongoose");
const express  = require("express");

const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())

mongoose.set('strictQuery', false);
const cors = require('cors');
app.use(cors());

dotenv.config({path:'./config.env'});
require('./db/conn');
app.use(express.json())
const User = require('./model/userSchema');

//We link the router file to make our route easy
app.use(require('./router/auth'));  
const PORT  = process.env.PORT;

// app.get('/about', middleware, (req, res) =>{
//     res.send("This is About");
// })

// app.get('/contact', (req, res) =>{
//     res.send("This is contact");
// })

app.get('/signin', (req, res) =>{
    res.send("This is Signin");
})

app.post('/register', (req, res) =>{
    res.send("This is Signup");
})

app.listen(PORT, ()=>{
    console.log(`PORT ${PORT}!!`);
})


