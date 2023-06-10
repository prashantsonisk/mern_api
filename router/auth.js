const express = require('express');
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const router  = express.Router();
const authenticate = require("../middleware/authenticate");

require('../db/conn');
const User = require('../model/userSchema');

router.get('/', (req, res)=>{
    res.send('This is router');
})

router.post('/register', async(req, res)=>{
    // console.log('data insert');
    const {name, email, phone, work, password} = req.body;

        if(!name || !email || !phone || !work || !password){
            return res.status(422).json({error:"Please fill the all fields!!"});
        }
        
       try
       {
            const userExist =  await User.findOne({email:email})

            if(userExist)
            {
                return res.status(422).json({error:"Email already exist!!"});
            }
            else
            {
                const user = new User({name, email, phone, work, password});
                await user.save();
                res.status(201).json({message:"User registered."});
            }
       }catch (error){
            console.log(error);
       }
});


// Login route
router.post('/signin', async(req,res)=>{
   try{ 
        // get data from json body
        const {email, password}= req.body;
        
        if(!email || !password)
        {
            return res.status(400).json({error:"Please fill the all fields!"})
        }

        const userLogin = await User.findOne({email:email});
        
        if(userLogin)
        {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();

            res.cookie("jwtoken", token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
            });

            // if user is not exist on database 
            if(!isMatch){
                res.status(400).json({error:"Invalid Credientials"});
            }
            else{
                res.json({message:"You have logged In!!"})
            }
        }
        else{
            res.status(400).json({error:"Invalid Credientials"});
        }

   }catch(e){
        console.log(e);
   }
})

router.get('/about', authenticate, (req, res) => {
    res.send(req.rootUser);
});

// Get data for contact form
router.get('/getData', authenticate, (req, res) => {
    res.send(req.rootUser);
});

// Get data for contact form
router.post('/contact', authenticate, async(req, res) => {
    try{
        const {name, email, phone, message} = req.body;

        if(!name || !email || !phone || !message)
        {
            console.log('Error in contact form');
            return res.json({error:"Please fill the all fields"});
        }

        const userContact = await User.findOne({_id:req.userID});

        if(userContact){
            
            const userMessage = await userContact.addMessage(name,email,phone,message);
            await userContact.save();
            res.status(201).json({message: 'User contact added successfully'});
        }

    }
   catch(err) {
        console.log(err)
   }
});

// Logout account

router.get('/logout', (req, res) => {
    res.clearCookie('jwtoken', {path:'/'});
    res.status(200).send("User logout");
});

module.exports = router;