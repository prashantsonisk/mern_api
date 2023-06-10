// const validator = require("validator");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//creating schema of user

const userSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true,
            minlength:3
        },
        email:{
            type:String,
            required:true,
    },
    password:{
        type:String,
        required:true,
        unique:true,
        minLength: 8, 
        minLowercase: 1,
        minUppercase: 1
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    messages:[
        {
            name:{
                type:String,
                required:true,
            },
            email:{
                type:String,
                required:true,
            },
            phone:{
                type:Number,
                required:true,
            },
            message:{
                type:String,
                required:true,
            }
        }
    ],
    phone:{
        type:Number,
        min:12,
        required:true,
    },
    work:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
        type:String,
        required:true,
        }
    }]
});

//We are hashing password 
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// We are generating json web token for authenrication
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

// stored messages

userSchema.methods.addMessage = async function (name, email, phone, message){
    try{
        this.messages = this.messages.concat({name, email, phone, message});
        await this.save();
        return this.messages;

    }catch(err){
        console.log(err);
    }
}

const User = mongoose.model('USER', userSchema);
module.exports = User;